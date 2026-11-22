import type { User, Checklist, Message } from '../api/schemas';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Анна Смирнова',
    role: 'intern',
    team: 'Payments',
    email: 'anna.smirnova@example.com',
    messenger: '@anna_smirnova',
    avatarInitials: 'АС',
    mentorId: 'u2',
    hrBpId: 'u3',
  },
  {
    id: 'u2',
    name: 'Иван Петров',
    role: 'mentor',
    team: 'Payments',
    email: 'ivan.petrov@example.com',
    messenger: '@ivan_petrov',
    phone: '+7 999 123-45-67',
    avatarInitials: 'ИП',
  },
  {
    id: 'u3',
    name: 'Мария Козлова',
    role: 'manager',
    team: 'Payments',
    email: 'maria.kozlova@example.com',
    messenger: '@maria_kozlova',
    avatarInitials: 'МК',
  },
];

export const mockChecklist: Checklist = {
  stages: [
    {
      id: 'stage-1',
      title: 'Первый день',
      items: [
        { id: 'i1', title: 'Получить ноутбук', status: 'done' },
        { id: 'i2', title: 'Настроить рабочее окружение', status: 'done' },
        { id: 'i3', title: 'Познакомиться с командой', status: 'done' },
      ],
    },
    {
      id: 'stage-2',
      title: 'Первая неделя',
      items: [
        { id: 'i4', title: 'Получить доступ к Git', status: 'done' },
        { id: 'i5', title: 'Изучить Playbook', status: 'in_progress' },
        { id: 'i6', title: 'Прочитать документацию проекта', status: 'todo' },
        {
          id: 'i7',
          title: 'Первая задача в Jira',
          status: 'blocked',
          blockedReason: 'Нет доступа к Jira. Обратись к @ivan_petrov',
        },
        { id: 'i8', title: 'Настроить IDE', status: 'todo' },
      ],
    },
    {
      id: 'stage-3',
      title: 'Первый месяц',
      items: [
        { id: 'i9', title: 'Закрыть первую задачу', status: 'todo' },
        { id: 'i10', title: 'Пройти ревью кода наставника', status: 'todo' },
      ],
    },
  ],
};

// Начальная история чата (приветствие бота)
export const mockMessages: Message[] = [
  {
    id: 'm1',
    author: 'bot',
    content: 'Привет, Анна! Я помогу освоиться в команде. С чего начнём?',
    createdAt: new Date().toISOString(),
  },
];