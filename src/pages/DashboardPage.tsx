import { useAuthStore } from "../stores/authStore"

export default function DashboardPage() {
  const currentUser = useAuthStore(state => state.currentUser)
  const logout = useAuthStore(state => state.logout)

  return (
    <>
      <div>{currentUser?.name}</div>
      <button onClick={logout}>Выход</button>
    </>
  )
}