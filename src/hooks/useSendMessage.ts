import { useMutation } from '@tanstack/react-query';
import { ChatApiResponseSchema, type Message } from '../api/schemas';
import { useChatStore } from '../stores/chatStore';

const ACTION_MARKER = /\[ACTION:leave_request\]/;

class ChatError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ChatError';
  }
}

async function sendMessageToApi(text: string): Promise<{ reply: string }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });

  if (!res.ok) {
    let message = 'Не удалось отправить сообщение.';
    try {
      const errBody = await res.json();
      if (typeof errBody?.error === 'string') message = errBody.error;
    } catch {

    }
    throw new ChatError(message, res.status);
  }

  const raw = await res.json();
  return ChatApiResponseSchema.parse(raw);
}

function isoDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function createBotMessage(reply: string): Message {
  const hasAction = ACTION_MARKER.test(reply);
  const text = reply.replace(ACTION_MARKER, '').trim();

  return {
    id: crypto.randomUUID(),
    author: 'bot',
    content: text,
    createdAt: new Date().toISOString(),
    actionCard: hasAction
      ? {
          kind: 'leave_request',
          title: 'Оформление отгула',
          fields: [
            { label: 'Дата', value: isoDatePlusDays(1), editable: true, type: 'date' },
            { label: 'Причина', value: 'личное', editable: true, type: 'text' },
            {
              label: 'Порядок',
              value: 'согласование с руководителем',
              editable: false,
              type: 'text',
            },
          ],
          status: 'proposal',
        }
      : undefined,
  };
}

export function useSendMessage() {
  const addMessage = useChatStore((s) => s.addMessage);
  const setSending = useChatStore((s) => s.setSending);
  const setError = useChatStore((s) => s.setError);

  return useMutation({
    mutationFn: sendMessageToApi,
    onMutate: (text) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        author: 'user',
        content: text,
        createdAt: new Date().toISOString(),
      };
      addMessage(userMessage);
      setSending(true);
      setError(null);
    },
    onSuccess: (data) => {
      addMessage(createBotMessage(data.reply));
      setSending(false);
    },
    onError: (error: ChatError) => {
      if (error.status === 504) {
        setError('Истекло время ожидания ответа. Попробуйте ещё раз.');
      } else if (error.status === 502) {
        setError('Агент или интеграция недоступны. Попробуйте ещё раз.');
      } else {
        setError(error.message || 'Не удалось отправить сообщение.');
      }
      setSending(false);
    },
  });
}