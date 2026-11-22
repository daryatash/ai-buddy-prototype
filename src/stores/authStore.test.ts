import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import { mockUsers } from '../mocks/data';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ currentUser: null, permissions: [] });
  });

  it('изначально пользователь не выбран', () => {
    expect(useAuthStore.getState().currentUser).toBeNull();
  });

  it('setCurrentUser кладёт пользователя и вычисляет права', () => {
    const intern = mockUsers[0];
    useAuthStore.getState().login(intern);

    expect(useAuthStore.getState().currentUser).toEqual(intern);
    expect(useAuthStore.getState().permissions).toContain('view_mentor_contacts');
    expect(useAuthStore.getState().permissions).not.toContain('approve_leave_request');
  });

  it('logout очищает пользователя и права', () => {
    useAuthStore.getState().login(mockUsers[0]);
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(useAuthStore.getState().permissions).toEqual([]);
  });

  it('hasPermission возвращает true для доступного права', () => {
    useAuthStore.getState().login(mockUsers[1]);
    expect(useAuthStore.getState().hasPermission('approve_leave_request')).toBe(true);
  });

  it('hasPermission возвращает false для недоступного права', () => {
    useAuthStore.getState().login(mockUsers[0]);
    expect(useAuthStore.getState().hasPermission('approve_leave_request')).toBe(false);
  });
});