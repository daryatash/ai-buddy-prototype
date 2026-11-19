import type { Checklist, ChecklistStage, ChecklistItem } from '../api/schemas';

export interface ProgressInfo {
  doneCount: number;
  totalCount: number;
  percent: number;
}

export function calculateProgress(checklist: Checklist): ProgressInfo {
  const allItems = checklist.stages.flatMap((s) => s.items);
  const doneCount = allItems.filter((i) => i.status === 'done').length;
  const totalCount = allItems.length;
  const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  return { doneCount, totalCount, percent };
}

export function getStageProgress(stage: ChecklistStage): ProgressInfo {
  const doneCount = stage.items.filter((i) => i.status === 'done').length;
  const totalCount = stage.items.length;
  const percent = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  return { doneCount, totalCount, percent };
}

export function getNextStep(checklist: Checklist): ChecklistItem | null {
  const allItems = checklist.stages.flatMap((s) => s.items);

  const inProgress = allItems.find((i) => i.status === 'in_progress');
  if (inProgress) return inProgress;

  const todo = allItems.find((i) => i.status === 'todo');
  if (todo) return todo;

  return null;
}