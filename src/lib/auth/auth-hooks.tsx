import { useContext, use } from 'react'
import { AuthContext, getCurrentUserPromise } from './auth-context'
import type { User } from './types'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Suspense-compatible hook using React 19's use()
export function useCurrentUser(): User | null {
  return use(getCurrentUserPromise())
}