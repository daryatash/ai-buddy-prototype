import { useAuthStore } from "../stores/authStore";

export function Header() {
  const currentUser = useAuthStore(state => state.currentUser)

  if (!currentUser) return <div>Нет пользователя</div>

  return (
    <div>{currentUser.name}</div>
  );
}