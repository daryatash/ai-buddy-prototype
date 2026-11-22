import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChecklistPanel } from './ChecklistPanel';

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('ChecklistPanel', () => {
  it('показывает прогресс после загрузки', async () => {
    renderWithQuery(<ChecklistPanel />);

    await waitFor(
      () => {
        expect(screen.getByText(/из \d+ задач/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('показывает этапы адаптации', async () => {
    renderWithQuery(<ChecklistPanel />);
    await waitFor(
      () => {
        expect(screen.getByText('Первый день')).toBeInTheDocument();
        expect(screen.getByText('Первая неделя')).toBeInTheDocument();
        expect(screen.getByText('Первый месяц')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('показывает бейдж у заблокированной задачи', async () => {
    renderWithQuery(<ChecklistPanel />);
    await waitFor(
      () => {
        expect(screen.getByText('Нет доступа')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('показывает блок «Следующий шаг» с первой in_progress задачей', async () => {
    renderWithQuery(<ChecklistPanel />);
    await waitFor(
      () => {
        const nextStepTitle = screen.getByText('Следующий шаг');
        const nextStepBlock = nextStepTitle.parentElement!;
        expect(within(nextStepBlock).getByText('Изучить Playbook')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});