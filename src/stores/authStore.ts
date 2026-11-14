import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Role } from "../api/schemas";

const rolePermissions: Record<Role, string[]> = {
  intern: ['view_own_checklist', 'view_mentor_contacts', 'view_hr_contacts'],
  mentor: ['view_own_checklist', 'view_intern_contacts', 'approve_leave_request'],
  manager: ['view_own_checklist', 'view_intern_contacts', 'approve_leave_request', 'view_team_checklists'],
};

interface AuthState {
  currentUser: User | null,
  permissions: string[],
  login: (user: User) => void,
  logout: () => void,
  hasPermission: (permission: string) => boolean,
}

export const useAuthStore = create<AuthState>()(persist(
    (set, get) => ({
      currentUser: null,
      permissions: [],

      login: (user) => set({
        currentUser: user,
        permissions: rolePermissions[user.role] ?? []
      }),

      logout: () => set({
        currentUser: null,
        permissions: [],
      }),

      hasPermission: (permission) => get().permissions.includes(permission)
    }),
    {
      name: "ai-buddy-auth"
    }
  )
)