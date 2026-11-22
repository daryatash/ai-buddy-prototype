import { useMutation } from '@tanstack/react-query';
import { LeaveRequestResponseSchema, type LeaveRequestResponse } from '../api/schemas';

async function sendLeaveRequest(): Promise<LeaveRequestResponse> {
  const res = await fetch('/api/actions/leave-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error('Не удалось отправить запрос. Попробуйте ещё раз.');
  }

  const raw = await res.json();
  return LeaveRequestResponseSchema.parse(raw);
}

export function useLeaveRequest() {
  return useMutation({
    mutationFn: sendLeaveRequest,
  });
}