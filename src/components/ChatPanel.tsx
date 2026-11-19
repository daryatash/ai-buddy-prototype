import styles from './ChatPanel.module.css';

const QUICK_QUESTIONS = [
  'Где получить доступ к Jira?',
  'Кто мой наставник?',
  'Как оформить отгул?',
];

export function ChatPanel() {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Твой помощник</h1>
        <p className={styles.subtitle}>Задай вопрос о команде, инструментах или процессах</p>
      </div>

      <div className={styles.messages}>
        <p className={styles.empty}>История сообщений появится здесь</p>
      </div>

      <div className={styles.chips}>
        {QUICK_QUESTIONS.map((q) => (
          <button key={q} type="button" className={styles.chip}>
            {q}
          </button>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input className={styles.input} placeholder="Напиши вопрос..." />
        <button type="button" className={styles.sendButton} aria-label="Отправить">
          →
        </button>
      </div>
    </section>
  );
}