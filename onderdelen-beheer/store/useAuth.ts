import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (code: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User | null) => void
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (code: string) => {
        // Simple access code check
        if (code === process.env.NEXT_PUBLIC_ACCESS_CODE || code === 'demo2024') {
          const user: User = {
            id: 'single-user',
            authenticated: true,
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)