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
    { label: 'Дата', value: '15 ноября 2026' },
    { label: 'Причина', value: 'личное' },
  ],
  status: 'proposal',
};

describe('ActionCard', () => {
  it('в состоянии proposal показывает поля и кнопки', () => {
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={vi.fn()} />);
    expect(screen.getByText('Оформление отгула')).toBeInTheDocument();
    expect(screen.getByText('15 ноября 2026')).toBeInTheDocument();
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
  });

  it('по клику «Подтвердить» вызывает onUpdate с sending, затем с result', async () => {
    const onUpdate = vi.fn();
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button', { name: /Подтвердить/ }));

    expect(onUpdate).toHaveBeenCalledWith({ ...proposalCard, status: 'sending' });

    await waitFor(() => {
      expect(onUpdate).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'result', requestId: expect.stringMatching(/^REQ-/) }),
      );
    });
  });

  it('по клику «Изменить» переводит в result с «Отменено»', async () => {
    const onUpdate = vi.fn();
    renderWithQuery(<ActionCard card={proposalCard} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole('button', { name: /Изменить/ }));

    expect(onUpdate).toHaveBeenCalledWith({
      ...proposalCard,
      status: 'result',
      resultMessage: 'Запрос отменён.',
    });
  });
});