import { describe, it, expect } from 'vitest';
import { mockUsers, mockChecklist, mockMessages } from './data';
import { UserSchema, ChecklistSchema, MessageSchema } from '../api/schemas';

describe('mock-данные проходят Zod-схемы', () => {
  it('все пользователи валидны', () => {
    mockUsers.forEach((user) => {
      expect(() => UserSchema.parse(user)).not.toThrow();
    });
  });

  it('чек-лист валиден', () => {
    expect(() => ChecklistSchema.parse(mockChecklist)).not.toThrow();
  });

  it('все сообщения валидны', () => {
    mockMessages.forEach((msg) => {
      expect(() => MessageSchema.parse(msg)).not.toThrow();
    });
  });
});