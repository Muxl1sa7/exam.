import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, isAuthenticated, logout, setAuth } = useAuthStore()
  return { user, isAuthenticated, logout, setAuth }
}
