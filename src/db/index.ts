import { openDB, type IDBPDatabase } from 'idb'
import type {
  WorkoutSession,
  ExerciseProgress,
  UserStats,
  OverloadState,
} from '../types'

const DB_VERSION = 1

const dbCache: Record<string, Promise<IDBPDatabase<WorkoutDB>>> = {}

function currentUserId(): string {
  return localStorage.getItem('workout-current-user') ?? 'default'
}

export type WorkoutDB = {
  sessions: {
    key: string
    value: WorkoutSession
    indexes: { 'by-date': string }
  }
  progress: {
    key: string
    value: ExerciseProgress
    indexes: { 'by-exercise': string; 'by-date': string }
  }
  overload: {
    key: string
    value: OverloadState
  }
  stats: {
    key: string
    value: UserStats
  }
}

export function getDB() {
  const uid = currentUserId()
  if (!dbCache[uid]) {
    dbCache[uid] = openDB<WorkoutDB>(`workout-app-${uid}`, DB_VERSION, {
      upgrade(db) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
        sessionStore.createIndex('by-date', 'date')

        const progressStore = db.createObjectStore('progress', {
          keyPath: 'id',
          autoIncrement: false,
        })
        progressStore.createIndex('by-exercise', 'exerciseId')
        progressStore.createIndex('by-date', 'date')

        db.createObjectStore('overload', { keyPath: 'exerciseId' })
        db.createObjectStore('stats', { keyPath: 'id' })
      },
    })
  }
  return dbCache[uid]
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function saveSession(session: WorkoutSession) {
  const db = await getDB()
  await db.put('sessions', session)
}

export async function getSession(id: string): Promise<WorkoutSession | undefined> {
  const db = await getDB()
  return db.get('sessions', id)
}

export async function getAllSessions(): Promise<WorkoutSession[]> {
  const db = await getDB()
  const sessions = await db.getAllFromIndex('sessions', 'by-date')
  return sessions.reverse()
}

export async function getSessionByDate(date: string): Promise<WorkoutSession | undefined> {
  const db = await getDB()
  return db.getFromIndex('sessions', 'by-date', date)
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export async function saveProgress(record: ExerciseProgress & { id: string }) {
  const db = await getDB()
  await db.put('progress', record)
}

export async function getProgressForExercise(exerciseId: string): Promise<ExerciseProgress[]> {
  const db = await getDB()
  return db.getAllFromIndex('progress', 'by-exercise', exerciseId)
}

// ─── Overload ─────────────────────────────────────────────────────────────────

export async function getOverload(exerciseId: string): Promise<OverloadState | undefined> {
  const db = await getDB()
  return db.get('overload', exerciseId)
}

export async function saveOverload(state: OverloadState) {
  const db = await getDB()
  await db.put('overload', state)
}

export async function getAllOverloads(): Promise<OverloadState[]> {
  const db = await getDB()
  return db.getAll('overload')
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS_KEY = 'main'

const DEFAULT_STATS: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
  totalSessions: 0,
  currentProgramWeek: 1,
  programStartDate: null,
}

export async function getStats(): Promise<UserStats> {
  const db = await getDB()
  const record = await db.get('stats', STATS_KEY)
  return (record as unknown as UserStats & { id: string }) ?? { ...DEFAULT_STATS }
}

export async function saveStats(stats: UserStats) {
  const db = await getDB()
  await db.put('stats', { ...stats, id: STATS_KEY } as unknown as UserStats)
}
