import type { User } from "../api/schemas"
import styles from './UserCard.module.css'

type UserCardProps = {
  user: User,
  onSelect: (user: User) => void
}

const roleLabels: Record<User['role'], string> = {
    intern: 'Стажёр',
    mentor: 'Наставник',
    manager: 'Руководитель',
}

export default function UserCard({ user, onSelect }: UserCardProps) {

  return (
    <button type="button" className={styles.card} onClick={() => onSelect(user)}>
      <div className={styles.card__avatar}>{user.avatarInitials}</div>
      <div className={styles.card__info}>
        <span className={styles.card__name}>{user.name}</span>
        <span className={styles.card__role}>{roleLabels[user.role]} · {user.team}</span>
      </div>
      <span className={styles.card__arrow} aria-hidden="true">→</span>
    </button>
  )
}