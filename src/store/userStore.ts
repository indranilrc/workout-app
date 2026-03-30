import { create } from 'zustand'

export interface UserProfile {
  id: string
  name: string
  color: string  // tailwind color class
}

export const USERS: UserProfile[] = [
  { id: 'irc', name: 'IRC', color: 'orange' },
  { id: 'sj',  name: 'SJ',  color: 'purple' },
]

const STORAGE_KEY = 'workout-current-user'

interface UserState {
  currentUser: UserProfile | null
  selectUser: (id: string) => void
  clearUser: () => void
}

function loadUser(): UserProfile | null {
  const id = localStorage.getItem(STORAGE_KEY)
  return USERS.find(u => u.id === id) ?? null
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: loadUser(),

  selectUser: (id: string) => {
    const user = USERS.find(u => u.id === id) ?? null
    if (user) localStorage.setItem(STORAGE_KEY, id)
    set({ currentUser: user })
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ currentUser: null })
  },
}))
