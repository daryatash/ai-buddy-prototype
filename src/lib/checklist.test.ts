import { describe, it, expect } from 'vitest';
import { calculateProgress, getStageProgress, getNextStep } from './checklist';
import type { Checklist } from '../api/schemas';

const sampleChecklist: Checklist = {
  stages: [
    {
      id: 's1',
      title: 'Первый день',
      items: [
        { id: 'i1', title: 'Задача 1', status: 'done' },
        { id: 'i2', title: 'Задача 2', status: 'done' },
      ],
    },
    {
      id: 's2',
      title: 'Первая неделя',
      items: [
        { id: 'i3', title: 'Задача 3', status: 'in_progress' },
        { id: 'i4', title: 'Задача 4', status: 'todo' },
        { id: 'i5', title: 'Задача 5', status: 'blocked', blockedReason: 'нет доступа' },
      ],
    },
  ],
};

describe('calculateProgress', () => {
  it('считает done/total и процент', () => {
    const result = calculateProgress(sampleChecklist);
    expect(result.doneCount).toBe(2);
    expect(result.totalCount).toBe(5);
    expect(result.percent).toBe(40);
  });

  it('возвращает 0% для пустого чек-листа', () => {
    const result = calculateProgress({ stages: [] });
    expect(result.percent).toBe(0);
    expect(result.totalCount).toBe(0);
  });
});

describe('getStageProgress', () => {
  it('считает прогресс одного этапа', () => {
    const result = getStageProgress(sampleChecklist.stages[0]);
    expect(result.doneCount).toBe(2);
    expect(result.totalCount).toBe(2);
    expect(result.percent).toBe(100);
  });
});

describe('getNextStep', () => {
  it('возвращает in_progress задачу в приоритете', () => {
    const result = getNextStep(sampleChecklist);
    expect(result?.id).toBe('i3');
  });

  it('возвращает todo, если нет in_progress', () => {
    const checklist: Checklist = {
      stages: [
        {
          id: 's1',
          title: 'Этап',
          items: [
            { id: 'i1', title: 'A', status: 'done' },
            { id: 'i2', title: 'B', status: 'todo' },
          ],
        },
      ],
    };
    const result = getNextStep(checklist);
    expect(result?.id).toBe('i2');
  });

  it('возвращает null, если всё сделано', () => {
    const checklist: Checklist = {
      stages: [
        {
          id: 's1',
          title: 'Этап',
          items: [{ id: 'i1', title: 'A', status: 'done' }],
        },
      ],
    };
    expect(getNextStep(checklist)).toBeNull();
  });
});