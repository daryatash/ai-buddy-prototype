import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { ChatPanel } from './ChatPanel';
import { useChatStore } from '../stores/chatStore';

function renderWithQuery() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ChatPanel />
    </QueryClientProvider>,
  );
}

describe('ChatPanel', () => {
  beforeEach(() => {
    useChatStore.getState().reset();
  });

  it('показывает пустое состояние при отсутствии сообщений', () => {
    renderWithQuery();
    expect(screen.getByText('История сообщений появится здесь')).toBeInTheDocument();
  });

  it('добавляет сообщение пользователя оптимистично', async () => {
    renderWithQuery();

    const input = screen.getByPlaceholderText('Напиши вопрос...');
    await userEvent.type(input, 'привет{Enter}');

    await waitFor(() => {
      expect(screen.getByText('привет')).toBeInTheDocument();
    });
  });

  it('показывает индикатор «AI печатает», когда isSending=true', () => {
    useChatStore.setState({ isSending: true });
    renderWithQuery();
    expect(screen.getByText('AI печатает…')).toBeInTheDocument();
  });

  it('рендерит карточку отгула после ответа на вопрос про отгул', async () => {
    renderWithQuery();

    await userEvent.type(
      screen.getByPlaceholderText('Напиши вопрос...'),
      'Как оформить отгул?{Enter}',
    );

    await waitFor(
      () => {
        expect(screen.getByText('Оформление отгула')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Подтвердить/ })).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('по клику на чип отправляет вопрос', async () => {
    renderWithQuery();

    await userEvent.click(screen.getByRole('button', { name: /Кто мой наставник/ }));

    await waitFor(
      () => {
        expect(screen.getByText(/Иван Петров/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('при ошибке 504 показывает баннер и кнопку «Повторить»', async () => {
    server.use(
      http.post('/api/chat', () => {
        return HttpResponse.json({ error: 'timeout' }, { status: 504 });
      }),
    );

    renderWithQuery();

    await userEvent.type(screen.getByPlaceholderText('Напиши вопрос...'), 'вопрос{Enter}');

    await waitFor(() => {
      expect(
        screen.getByText('Истекло время ожидания ответа. Попробуйте ещё раз.'),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Повторить' })).toBeInTheDocument();
    });
  });

  it('дизейблит поле ввода, когда isSending=true', () => {
    useChatStore.setState({ isSending: true });
    renderWithQuery();
    const input = screen.getByPlaceholderText('Напиши вопрос...');
    expect(input).toBeDisabled();
  });
});