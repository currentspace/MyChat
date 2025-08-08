export interface User {
  id: string
  email: string
  name: string
  picture: string
  email_verified: boolean
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credential: string) => Promise<void>
  logout: () => Promise<void>
}