import { useQuery } from "@tanstack/react-query";
import { ChecklistSchema, type Checklist } from "../api/schemas";

async function fetchChecklist(): Promise<Checklist> {
  const result = await fetch('/api/checklist')
  if (!result.ok) {
    throw new Error(`Не удалось загрузить чек-лист: ${result.status}`);
  }
  const raw = await result.json()
  return ChecklistSchema.parse(raw)
}

export function useChecklist() {
  return useQuery({
    queryKey: ['checklist'],
    queryFn: fetchChecklist,
  })
}