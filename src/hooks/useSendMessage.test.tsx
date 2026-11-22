import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { useSendMessage } from './useSendMessage';
import { useChatStore } from '../stores/chatStore';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useSendMessage', () => {
  beforeEach(() => {
    useChatStore.getState().reset();
  });

  it('оптимистично добавляет сообщение пользователя и ответ бота', async () => {
    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate('Как оформить отгул?');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 });

    const { messages } = useChatStore.getState();
    expect(messages[0].author).toBe('user');
    expect(messages[0].content).toBe('Как оформить отгул?');
    expect(messages[1].author).toBe('bot');
    expect(messages[1].actionCard?.kind).toBe('leave_request');
    expect(messages[1].actionCard?.status).toBe('proposal');
  });

  it('извлекает маркер из ответа и не показывает его в тексте', async () => {
    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate('Как оформить отгул?', {
        onError: (err) => console.error('MUTATION ERROR:', err),
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 });

    const { messages } = useChatStore.getState();
    expect(messages[1].content).not.toContain('[ACTION:leave_request]');
    expect(messages[1].content).toContain('Порядок оформления отгула');
  });

  it('показывает isSending=true во время запроса и false после', async () => {
    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate('привет');
    });

    expect(useChatStore.getState().isSending).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 });
    expect(useChatStore.getState().isSending).toBe(false);
  });

  it('при 504 показывает сообщение об истечении времени', async () => {
    server.use(
      http.post('/api/chat', () => {
        return HttpResponse.json({ error: 'timeout' }, { status: 504 });
      }),
    );

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate('вопрос');
    });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 3000 });
    expect(useChatStore.getState().error).toBe(
      'Истекло время ожидания ответа. Попробуйте ещё раз.',
    );
    expect(useChatStore.getState().isSending).toBe(false);
  });

  it('при 502 показывает сообщение о недоступности агента', async () => {
    server.use(
      http.post('/api/chat', () => {
        return HttpResponse.json({ error: 'bad gateway' }, { status: 502 });
      }),
    );

    const { result } = renderHook(() => useSendMessage(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.mutate('вопрос');
    });

    await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 3000 });
    expect(useChatStore.getState().error).toBe(
      'Агент или интеграция недоступны. Попробуйте ещё раз.',
    );
  });
});