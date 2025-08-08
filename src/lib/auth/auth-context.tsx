import { createContext, useState, useEffect, ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import type { User, AuthContextType } from './types'

export const AuthContext = createContext<AuthContextType | null>(null)

// Create a promise that fetches the current user
let currentUserPromise: Promise<User | null> | null = null

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/me', {
      credentials: 'include'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return (data as { user: User }).user
  } catch {
    return null
  }
}

// Get or create the promise
export function getCurrentUserPromise() {
  currentUserPromise ??= fetchCurrentUser()
  return currentUserPromise
}

export function AuthProvider({ 
  children, 
  clientId 
}: { 
  children: ReactNode
  clientId: string 
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    void fetchCurrentUser().then(user => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const login = async (credential: string) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential }),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      const userData = (data as { user: User }).user
      setUser(userData)
      
      // Reset the promise for future use() calls
      currentUserPromise = Promise.resolve(userData)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
      // Reset the promise
      currentUserPromise = Promise.resolve(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  )
}

