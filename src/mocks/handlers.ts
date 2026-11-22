import { http, HttpResponse } from 'msw';
import { mockUsers, mockChecklist, mockMessages } from './data';
import { LeaveRequestResponseSchema } from '../api/schemas';

// Эмулируем задержку, чтобы увидеть состояния загрузки в UI
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handlers = [
  // GET /api/me — вернуть стажёра (первого в массиве)
  http.get('/api/me', async () => {
    await delay(300);
    return HttpResponse.json(mockUsers[0]);
  }),

  // GET /api/users — вернуть всех пользователей
  http.get('/api/users', async () => {
    await delay(300);
    return HttpResponse.json(mockUsers);
  }),

  // GET /api/checklist — вернуть чек-лист
  http.get('/api/checklist', async () => {
    await delay(500);
    return HttpResponse.json(mockChecklist);
  }),

  // GET /api/messages — начальная история чата
  http.get('/api/messages', async () => {
    await delay(300);
    return HttpResponse.json(mockMessages);
  }),

  // POST /api/chat — отправка сообщения, получаем ответ бота
  http.post('/api/chat', async ({ request }) => {
    const body = (await request.json()) as { message?: string };
    const message = body.message?.trim() ?? '';

    // Валидация как в Go: пустое сообщение → 400
    if (!message) {
      return HttpResponse.json({ error: 'Введите сообщение.' }, { status: 400 });
    }

    await delay(1500);
    const text = message.toLowerCase();

    if (text.includes('отгул')) {
      return HttpResponse.json({
        reply:
          'Порядок оформления отгула: создай заявку в сервисе отсутствий, укажи дату и причину «личное», затем согласуй с руководителем.\n[ACTION:leave_request]',
      });
    }

    if (text.includes('наставник')) {
      return HttpResponse.json({
        reply: 'Твой наставник — Иван Петров, @ivan_petrov. Он поможет с рабочими вопросами.',
      });
    }

    if (text.includes('доступ') || text.includes('jira')) {
      return HttpResponse.json({
        reply: 'Для доступа к Jira напиши наставнику @ivan_petrov. Он откроет заявку.',
      });
    }

    return HttpResponse.json({
      reply: 'Я пока учусь. Спроси про отгул, наставника или доступы.',
    });
}),

  // POST /api/actions/leave-request — имитация оформления отгула
  http.post('/api/actions/leave-request', async () => {
    await delay(800);
    const response = LeaveRequestResponseSchema.parse({
      requestId: 'REQ-' + Math.floor(Math.random() * 10000),
      status: 'pending',
      message: 'Запрос отправлен. Руководитель уведомлён.',
    });
    return HttpResponse.json(response);
  }),
];