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
    const body = (await request.json()) as { message: string };
    await delay(1500);

    const text = body.message.toLowerCase();

    // Простейшая "логика" бота на ключевых словах
    if (text.includes('отгул')) {
      return HttpResponse.json({
        id: crypto.randomUUID(),
        author: 'bot',
        content: 'Вот порядок оформления отгула. Проверь детали и подтверди.',
        createdAt: new Date().toISOString(),
        actionCard: {
          kind: 'leave_request',
          title: 'Оформление отгула',
          fields: [
            { label: 'Дата', value: '15 ноября 2026' },
            { label: 'Причина', value: 'личное' },
            { label: 'Порядок', value: 'согласование с руководителем' },
          ],
          status: 'proposal',
        },
      });
    }

    if (text.includes('наставник')) {
      return HttpResponse.json({
        id: crypto.randomUUID(),
        author: 'bot',
        content: 'Твой наставник — Иван Петров, @ivan_petrov. Он поможет с рабочими вопросами.',
        createdAt: new Date().toISOString(),
      });
    }

    if (text.includes('доступ') || text.includes('jira')) {
      return HttpResponse.json({
        id: crypto.randomUUID(),
        author: 'bot',
        content: 'Для доступа к Jira напиши своему наставнику @ivan_petrov. Он откроет заявку.',
        createdAt: new Date().toISOString(),
      });
    }

    // Ответ по умолчанию
    return HttpResponse.json({
      id: crypto.randomUUID(),
      author: 'bot',
      content: 'Я пока учусь. Спроси про отгул, наставника или доступы.',
      createdAt: new Date().toISOString(),
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