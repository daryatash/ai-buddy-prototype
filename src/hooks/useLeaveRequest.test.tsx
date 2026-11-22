import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLeaveRequest } from './useLeaveRequest';

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe('useLeaveRequest', () => {
  it('возвращает requestId и статус pending', async () => {
    const { result } = renderHook(() => useLeaveRequest(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 3000 },
    );

    expect(result.current.data?.status).toBe('pending');
    expect(result.current.data?.requestId).toMatch(/^REQ-/);
  });
});