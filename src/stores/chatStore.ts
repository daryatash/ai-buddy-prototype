import { create } from "zustand";
import type { Message, ActionCard } from '../api/schemas';

interface ChatState {
  messages: Message[],
  isSending: boolean,
  error: string | null,

  addMessage: (message: Message) => void,
  updateActionCard: (messageId: string, card: ActionCard) => void,
  setSending: (sending: boolean) => void,
  setError: (error: string | null) => void,
  reset: () => void,
}

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isSending: false,
  error: null,

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  updateActionCard: (messageId, card) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, actionCard: card } : m,
      ),
    })),

  setSending: (isSending) => set({ isSending }),
  setError: (error) => set({ error }),
  reset: () => set({ messages: [], isSending: false, error: null }),
}))