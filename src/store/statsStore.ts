import { create } from 'zustand'
import { getStats, saveStats } from '../db'
import type { UserStats } from '../types'
import { todayISO, isConsecutiveDay } from '../utils/dates'

interface StatsState {
  stats: UserStats
  loaded: boolean
  load: () => Promise<void>
  recordWorkoutComplete: () => Promise<void>
  advanceWeek: () => Promise<void>
  initProgram: () => Promise<void>
}

const DEFAULT_STATS: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  totalSessions: 0,
  currentProgramWeek: 1,
  programStartDate: null,
}

export const useStatsStore = create<StatsState>((set, get) => ({
  stats: DEFAULT_STATS,
  loaded: false,

  load: async () => {
    const stats = await getStats()
    set({ stats, loaded: true })
  },

  initProgram: async () => {
    const { stats } = get()
    if (stats.programStartDate) return
    const today = todayISO()
    const updated: UserStats = { ...stats, programStartDate: today, currentProgramWeek: 1 }
    await saveStats(updated)
    set({ stats: updated })
  },

  recordWorkoutComplete: async () => {
    const { stats } = get()
    const today = todayISO()
    let streak = stats.currentStreak

    if (stats.lastWorkoutDate === today) {
      // Already counted today
      return
    }

    if (stats.lastWorkoutDate && isConsecutiveDay(stats.lastWorkoutDate, today)) {
      streak += 1
    } else {
      streak = 1
    }

    const updated: UserStats = {
      ...stats,
      currentStreak: streak,
      longestStreak: Math.max(streak, stats.longestStreak),
      lastWorkoutDate: today,
      totalSessions: stats.totalSessions + 1,
    }
    await saveStats(updated)
    set({ stats: updated })
  },

  advanceWeek: async () => {
    const { stats } = get()
    const nextWeek = stats.currentProgramWeek >= 8 ? 1 : stats.currentProgramWeek + 1
    const updated: UserStats = {
      ...stats,
      currentProgramWeek: nextWeek,
      programStartDate: nextWeek === 1 ? todayISO() : stats.programStartDate,
    }
    await saveStats(updated)
    set({ stats: updated })
  },
}))
