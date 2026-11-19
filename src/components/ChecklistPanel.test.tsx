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
        expect(screen.getByText('1 неделя')).toBeInTheDocument();
        expect(screen.getByText('2 неделя')).toBeInTheDocument();
        expect(screen.getByText('1 месяц')).toBeInTheDocument();
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
        // Ищем текст задачи внутри карточки «Следующий шаг», а не по всему документу
        const nextStepBlock = nextStepTitle.parentElement!;
        expect(
          within(nextStepBlock).getByText(
            /Попроси руководителя или наставника добавить тебя в канал Tech-dep/,
          ),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});