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
      id: 'stage-week-1',
      title: '1 неделя',
      items: [
        { id: 'w1-1', title: 'Изучи принципы разработки Авито', status: 'done' },
        { id: 'w1-2', title: 'Изучи Авито в цифрах', status: 'done' },
        { id: 'w1-3', title: 'Настрой avito-cli', status: 'done' },
        { id: 'w1-4', title: 'Добавь ключи в stash', status: 'done' },
        {
          id: 'w1-5',
          title: 'Попроси руководителя или наставника добавить тебя в канал Tech-dep',
          status: 'in_progress',
        },
        { id: 'w1-6', title: 'Расскажи о Sentry', status: 'todo' },
        {
          id: 'w1-7',
          title: 'Прорешай задачи на учебной платформе',
          description: 'Познакомься с инструментами Авито',
          status: 'todo',
        },
      ],
    },
    {
      id: 'stage-week-2',
      title: '2 неделя',
      items: [
        { id: 'w2-1', title: 'Изучи документацию по Go', status: 'done' },
        {
          id: 'w2-2',
          title: 'Данные и хранилища Авито',
          description: 'Изучи документацию по работе с базами данных в Авито',
          status: 'todo',
        },
        {
          id: 'w2-3',
          title: 'Расскажи о Observer',
          status: 'blocked',
          blockedReason: 'Нужен доступ к системе мониторинга. Обратись к @ivan_petrov',
        },
        {
          id: 'w2-4',
          title: 'Изучи PaaS: дашборд и новости',
          status: 'todo',
        },
        { id: 'w2-5', title: 'Изучи профили инженеров', status: 'todo' },
      ],
    },
    {
      id: 'stage-month-1',
      title: '1 месяц',
      items: [
        {
          id: 'm1-1',
          title: 'Курс про Agile-инструменты',
          description: 'Изучи курс Agile в Авито. Изучи Agile и Scrum в работе над проектами — особенности команды выучишь на практике',
          status: 'todo',
        },
        {
          id: 'm1-2',
          title: 'Изучи микросервисную архитектуру в Авито',
          description: 'Пройди курс «Микросервисная архитектура в Авито»',
          status: 'todo',
        },
        {
          id: 'm1-3',
          title: 'Сниффер запросов',
          description: 'Установи bruno или charles, LENS для работы с Kubernetes',
          status: 'todo',
        },
        { id: 'm1-4', title: 'Изучи информацию про SPT', status: 'todo' },
        { id: 'm1-5', title: 'Изучи Zero Bug Policy (ZBP)', status: 'todo' },
        { id: 'm1-6', title: 'Расскажи о Grafana', status: 'todo' },
        { id: 'm1-7', title: 'Изучи информацию про API', status: 'todo' },
        { id: 'm1-8', title: 'Изучи Effective Go', status: 'todo' },
      ],
    },
    {
      id: 'stage-month-2',
      title: '2 месяц',
      items: [
        { id: 'm2-1', title: 'Изучи Демо Tech Platform', status: 'todo' },
        {
          id: 'm2-2',
          title: 'Изучи документацию по нагрузочному тестированию',
          status: 'todo',
        },
        { id: 'm2-3', title: 'Изучи инфомодель', status: 'todo' },
      ],
    },
    {
      id: 'stage-month-3',
      title: '3 месяц',
      items: [
        { id: 'm3-1', title: 'Расскажи о Redash', status: 'todo' },
        {
          id: 'm3-2',
          title: 'Пройди курс «Паттерны и практики написания кода»',
          status: 'todo',
        },
        {
          id: 'm3-3',
          title: 'Найди подходящее сообщество в Центре сообществ Авито',
          status: 'todo',
        },
        {
          id: 'm3-4',
          title: 'Познакомься с процессом Шаталити',
          description: 'Помогает планировать задачи так, чтобы плановые работы на разных сервисах не совпадали по времени',
          status: 'todo',
        },
      ],
    },
    {
      id: 'stage-after-3-months',
      title: 'После 3 месяцев',
      items: [
        {
          id: 'a3-1',
          title: 'Язык программирования Go: Донован, Керниган',
          status: 'todo',
        },
        {
          id: 'a3-2',
          title: 'Ричардсон Крис. Микросервисы. Паттерны разработки и рефакторинга',
          status: 'todo',
        },
        {
          id: 'a3-3',
          title: 'Бхаргава Адитья. Грокаем алгоритмы',
          status: 'todo',
        },
        {
          id: 'a3-4',
          title: 'Клеппман Мартин. Высоконагруженные приложения',
          status: 'todo',
        },
        {
          id: 'a3-5',
          title: 'Рекомендуемые материалы от Димы Ходакова',
          description: 'Уэзеролл, Таненбаум «Компьютерные системы и сети»; Кормен «Алгоритмы»; Макконнелл «Совершенный код»; Мартин «Чистый код»; Хант «Программист-прагматик»',
          status: 'todo',
        },
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