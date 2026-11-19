import { useAuthStore } from "../stores/authStore";
import styles from "./Header.module.css";

export function Header() {
  const currentUser = useAuthStore(state => state.currentUser)
  const logout = useAuthStore(state => state.logout)

  if (!currentUser) return null

  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <div className={styles.header__icon}>AI</div>
        <span>AI-buddy</span>
      </div>
      <div className={styles.header__center}>
        <span>{currentUser.name}</span>
        <span className={styles.header__team}>{currentUser.team}</span>
        <span className={styles.header__mentor}>Наставник: Иван Петров</span>
      </div>
      <div className={styles.header__right}>
        <button type="button" className={styles.header__help} aria-label="Помощь">
          ?
        </button>
        <button
          type="button"
          className={styles.header__avatar}
          onClick={logout}
          title="Сменить пользователя"
        >
          {currentUser.avatarInitials}
        </button>
      </div>
    </header>
  )
}