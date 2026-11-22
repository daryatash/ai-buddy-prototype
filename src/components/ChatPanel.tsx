import { useEffect, useRef, useState } from 'react';
import styles from './ChatPanel.module.css';
import { useSendMessage } from '../hooks/useSendMessage';
import { useChatStore } from '../stores/chatStore';
import { ActionCard } from './ActionCard';

const QUICK_QUESTIONS = [
  'Где получить доступ к Jira?',
  'Кто мой наставник?',
  'Как оформить отгул?',
];

export function ChatPanel() {
  const [text, setText] = useState('');
  const { mutate, isPending } = useSendMessage();

  const messages = useChatStore((s) => s.messages);
  const error = useChatStore((s) => s.error);
  const updateActionCard = useChatStore((s) => s.updateActionCard);

  const listRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при новых сообщениях / индикаторе
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages.length, isPending]);

  const handleSend = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isPending) return;
    mutate(trimmed);
    setText('');
  };

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Твой помощник</h1>
        <p className={styles.subtitle}>
          Задай вопрос о команде, инструментах или процессах
        </p>
      </div>

      <div className={styles.messages} ref={listRef}>
        {messages.length === 0 && !isPending && (
          <p className={styles.empty}>История сообщений появится здесь</p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.message} ${
              m.author === 'user' ? styles.user : styles.bot
            }`}
          >
            <div className={styles.bubble}>{m.content}</div>

            {m.actionCard && (
              <div className={styles.cardWrap}>
                <ActionCard
                  card={m.actionCard}
                  onUpdate={(next) => updateActionCard(m.id, next)}
                />
              </div>
            )}
          </div>
        ))}

        {isPending && (
          <div className={`${styles.message} ${styles.bot}`}>
            <div className={styles.typing} aria-label="Помощник печатает">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.chips}>
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            className={styles.chip}
            onClick={() => handleSend(q)}
            disabled={isPending}
          >
            {q}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          placeholder="Напиши вопрос..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(text);
          }}
          disabled={isPending}
        />
        <button
          type="button"
          className={styles.sendButton}
          aria-label="Отправить"
          onClick={() => handleSend(text)}
          disabled={isPending || !text.trim()}
        >
          →
        </button>
      </div>
    </section>
  );
}