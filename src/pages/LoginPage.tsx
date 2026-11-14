import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../api/schemas';
import { mockUsers } from '../mocks/data';
import UserCard from '../components/UserCard';

export function LoginPage() {

  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)

  const handleSelect = (user: User) => {
    navigate('/dashboard')
    login(user)
  }

  const internUser = mockUsers[0]

  return (
    <div className={styles.login}>
      <h1 className={styles.login__title}>AI-buddy</h1>
      <p className={styles.login__subtitle}>Выбери тестового пользователя</p>
      <div className={styles.login__user}>
        <UserCard user={internUser} onSelect={handleSelect} />
      </div>
    </div>
  );
}