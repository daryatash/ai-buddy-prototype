import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActionCard } from './ActionCard';
import type { ActionCard as ActionCardData } from '../api/schemas';

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const proposalCard: ActionCardData = {
  kind: 'leave_request',
  title: 'Оформление отгула',
  fields: [
    { label: 'Дата', value: '2026-11-15', type: 'date' },
    { label: 'Причина', value: 'личное' },
    { label: 'Порядок', value: 'согласование с руководителем', editable: false },
  ],
  status: 'proposal',
};

describe('ActionCard', () => {
  it('в состоянии proposal показывает поля и кнопки', () => {
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={vi.fn()} />);
    expect(screen.getByText('Оформление отгула')).toBeInTheDocument();
    // Дата форматируется через formatDate
    expect(screen.getByText(/15 ноября 2026/)).toBeInTheDocument();
    expect(screen.getByText('личное')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Подтвердить/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Изменить/ })).toBeInTheDocument();
  });

  it('в состоянии sending показывает спиннер', () => {
    renderWithQuery(
      <ActionCard card={{ ...proposalCard, status: 'sending' }} onUpdate={vi.fn()} />,
    );
    expect(screen.getByText(/Отправляем запрос/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Подтвердить/ })).not.toBeInTheDocument();
  });

  it('в состоянии result показывает requestId и сообщение', () => {
    renderWithQuery(
      <ActionCard
        card={{
          ...proposalCard,
          status: 'result',
          requestId: 'REQ-1234',
          resultMessage: 'Запрос отправлен. Руководитель уведомлён.',
        }}
        onUpdate={vi.fn()}
      />,
    );
    expect(screen.getByText('Запрос отправлен')).toBeInTheDocument();
    expect(screen.getByText(/REQ-1234/)).toBeInTheDocument();
    expect(screen.getByText('Запрос отправлен. Руководитель уведомлён.')).toBeInTheDocument();
  });

  it('по клику «Подтвердить» вызывает onUpdate с sending, затем с result', async () => {
    const onUpdate = vi.fn();
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button', { name: /Подтвердить/ }));

    // Первый вызов — sending
    expect(onUpdate).toHaveBeenCalledWith({ ...proposalCard, status: 'sending' });

    // Дожидаемся ответа MSW и проверяем result
    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: 'result',
          requestId: expect.stringMatching(/^REQ-/),
          resultMessage: 'Запрос отправлен. Руководитель уведомлён.',
        }),
      );
    });
  });

  it('по клику «Изменить» переходит в режим редактирования', async () => {
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /Изменить/ }));

    // Появились кнопки «Сохранить» и «Отмена» (редактирования)
    expect(screen.getByRole('button', { name: /Сохранить/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Отмена/ })).toBeInTheDocument();

    // Поля стали инпутами
    expect(screen.getByDisplayValue('личное')).toBeInTheDocument();
  });

  it('в режиме редактирования нередактируемое поле показывается как текст, а не input', async () => {
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /Изменить/ }));

    // «Порядок» имеет editable: false — показывается как текст
    expect(screen.getByText('согласование с руководителем')).toBeInTheDocument();
    // Инпута с этим значением нет
    expect(screen.queryByDisplayValue('согласование с руководителем')).not.toBeInTheDocument();
  });

  it('«Сохранить» вызывает onUpdate с обновлёнными полями и статусом proposal', async () => {
    const onUpdate = vi.fn();
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button', { name: /Изменить/ }));

    const input = screen.getByDisplayValue('личное');
    await userEvent.clear(input);
    await userEvent.type(input, 'семейные обстоятельства');

    await userEvent.click(screen.getByRole('button', { name: /Сохранить/ }));

    expect(onUpdate).toHaveBeenCalledWith({
      ...proposalCard,
      fields: [
        { label: 'Дата', value: '2026-11-15', type: 'date' },
        { label: 'Причина', value: 'семейные обстоятельства' },
        { label: 'Порядок', value: 'согласование с руководителем', editable: false },
      ],
      status: 'proposal',
    });
  });

  it('«Отмена» в режиме редактирования не вызывает onUpdate и возвращает к proposal', async () => {
    const onUpdate = vi.fn();
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button', { name: /Изменить/ }));
    await userEvent.click(screen.getByRole('button', { name: /Отмена/ }));

    expect(onUpdate).not.toHaveBeenCalled();
    // Снова видны кнопки proposal-режима
    expect(screen.getByRole('button', { name: /Подтвердить/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Изменить/ })).toBeInTheDocument();
  });
});