import { useState } from 'react';
import type { ActionCard as ActionCardData } from '../api/schemas';
import { useLeaveRequest } from '../hooks/useLeaveRequest';
import styles from './ActionCard.module.css';

interface ActionCardProps {
  card: ActionCardData;
  onUpdate: (next: ActionCardData) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function ActionCard({ card, onUpdate }: ActionCardProps) {
  const mutation = useLeaveRequest();
  const [isEditing, setIsEditing] = useState(false);
  const [draftFields, setDraftFields] = useState(card.fields);

  const handleConfirm = () => {
    onUpdate({ ...card, status: 'sending' });
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        onUpdate({
          ...card,
          status: 'result',
          requestId: data.requestId,
          resultMessage: data.message,
        });
      },
      onError: () => {
        onUpdate({ ...card, status: 'proposal' });
      },
    });
  };

  const handleStartEdit = () => {
    setDraftFields(card.fields);
    setIsEditing(true);
  };

  const handleFieldChange = (index: number, value: string) => {
    setDraftFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, value } : f)),
    );
  };

  const handleSaveEdit = () => {
    onUpdate({ ...card, fields: draftFields, status: 'proposal' });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setDraftFields(card.fields);
    setIsEditing(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>📋</span>
        <span className={styles.title}>{card.title}</span>
      </div>

      {isEditing ? (
        <div className={styles.fields}>
          {draftFields.map((f, i) => {
            const editable = f.editable !== false;

            return (
              <div key={f.label} className={styles.field}>
                <label className={styles.label}>{f.label}</label>

                {!editable ? (
                  <div className={styles.readonlyValue}>{f.value}</div>
                ) : f.type === 'date' ? (
                  <input
                    type="date"
                    className={styles.editInput}
                    value={f.value}
                    onChange={(e) => handleFieldChange(i, e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className={styles.editInput}
                    value={f.value}
                    onChange={(e) => handleFieldChange(i, e.target.value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <dl className={styles.fields}>
          {card.fields.map((f) => (
            <div key={f.label} className={styles.field}>
              <dt className={styles.label}>{f.label}</dt>
              <dd className={styles.value}>
                {f.type === 'date' ? formatDate(f.value) : f.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {card.status === 'proposal' && !isEditing && (
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={handleConfirm}>
            Подтвердить и отправить
          </button>
          <button type="button" className={styles.secondary} onClick={handleStartEdit}>
            Изменить
          </button>
        </div>
      )}

      {card.status === 'proposal' && isEditing && (
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={handleSaveEdit}>
            Сохранить
          </button>
          <button type="button" className={styles.secondary} onClick={handleCancelEdit}>
            Отмена
          </button>
        </div>
      )}

      {card.status === 'sending' && (
        <div className={styles.status}>
          <span className={styles.spinner} aria-hidden="true" />
          Отправляем запрос…
        </div>
      )}

      {card.status === 'result' && (
        <div className={styles.result}>
          <span className={styles.resultIcon}>✓</span>
          <div>
            <div className={styles.resultTitle}>
              {card.requestId ? 'Запрос отправлен' : 'Отменено'}
            </div>
            {card.resultMessage && (
              <div className={styles.resultText}>{card.resultMessage}</div>
            )}
            {card.requestId && (
              <div className={styles.resultMeta}>№{card.requestId} · на согласовании</div>
            )}
          </div>
        </div>
      )}

      {mutation.isError && (
        <div className={styles.error}>
          {mutation.error instanceof Error ? mutation.error.message : 'Ошибка отправки'}
          <button type="button" className={styles.retry} onClick={handleConfirm}>
            Повторить
          </button>
        </div>
      )}
    </div>
  );
}