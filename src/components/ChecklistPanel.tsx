import { useChecklist } from '../hooks/useChecklist';
import { calculateProgress, getNextStep, getStageProgress } from '../lib/checklist';
import styles from './ChecklistPanel.module.css';

export function ChecklistPanel() {
  const { data: checklist, isLoading, isError, refetch } = useChecklist();

  if (isLoading) {
    return (
      <aside className={styles.panel}>
        <div className={styles.card}>
          <p className={styles.progressLabel}>Загружаем чек-лист...</p>
        </div>
      </aside>
    );
  }

  if (isError || !checklist) {
    return (
      <aside className={styles.panel}>
        <div className={styles.card}>
          <p className={styles.progressLabel}>Не удалось загрузить чек-лист.</p>
          <button type="button" className={styles.nextStepButton} onClick={() => refetch()}>
            Повторить
          </button>
        </div>
      </aside>
    );
  }

  const progress = calculateProgress(checklist);
  const nextStep = getNextStep(checklist);

  return (
    <aside className={styles.panel}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Твой прогресс</h2>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress.percent}%` }} />
        </div>
        <div className={styles.progressLabel}>
          {progress.percent}% · {progress.doneCount} из {progress.totalCount} задач
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Этапы адаптации</h2>
        <div className={styles.stages}>
          {checklist.stages.map((stage) => {
            const stageProgress = getStageProgress(stage);
            const allDone = stageProgress.doneCount === stageProgress.totalCount;
            return (
              <div key={stage.id} className={styles.stage}>
                <div className={styles.stageHeader}>
                  <span className={allDone ? styles.stageDone : undefined}>
                    {allDone ? '✓' : '○'}
                  </span>
                  <span>{stage.title}</span>
                  <span className={styles.stageCount}>
                    {stageProgress.doneCount}/{stageProgress.totalCount}
                  </span>
                </div>
                <ul className={styles.items}>
                  {stage.items.map((item) => (
                    <li
                      key={item.id}
                      className={`${styles.item} ${item.status === 'done' ? styles.itemDone : ''}`}
                    >
                      <span
                        className={`${styles.checkbox} ${
                          item.status === 'done'
                            ? styles.checkboxDone
                            : item.status === 'in_progress'
                              ? styles.checkboxInProgress
                              : ''
                        }`}
                      />
                      <span className={styles.itemText}>
                        <span>{item.title}</span>
                        {item.description && (
                          <span className={styles.itemDescription}>{item.description}</span>
                        )}
                      </span>
                      {item.status === 'blocked' && (
                        <span
                          className={`${styles.badge} ${styles.badgeBlocked}`}
                          title={item.blockedReason}
                        >
                          Нет доступа
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {nextStep && (
        <div className={styles.nextStep}>
          <h3 className={styles.nextStepTitle}>Следующий шаг</h3>
          <p className={styles.nextStepText}>{nextStep.title}</p>
          <button type="button" className={styles.nextStepButton}>
            Сделать →
          </button>
        </div>
      )}
    </aside>
  );
}