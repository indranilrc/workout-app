// ─── Equipment ───────────────────────────────────────────────────────────────

export type Equipment =
  | 'dumbbell'
  | 'barbell'
  | 'band-handle'    // exercise band with handles
  | 'band-loop'      // resistance loop band
  | 'bench'
  | 'mat'
  | 'jump-rope'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'cardio-machine'

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full-body'
  | 'cardio'

export type ResistanceLevel = 'light' | 'medium' | 'heavy' | 'x-heavy'

// ─── Exercise ────────────────────────────────────────────────────────────────

export interface Exercise {
  id: string
  name: string
  muscleGroups: MuscleGroup[]
  equipment: Equipment[]
  demoUrl?: string        // animated gif url
  notes?: string          // form cues
  isCardio?: boolean
}

// ─── Program ─────────────────────────────────────────────────────────────────

export type DayType = 'home' | 'gym' | 'walk' | 'rest'

export interface ProgramSet {
  reps: number            // target reps
  weight?: number         // starting weight in lbs (0 = bodyweight/band)
  duration?: number       // seconds (for cardio/plank)
  resistanceLevel?: ResistanceLevel
}

export interface ProgramExercise {
  exerciseId: string
  sets: number
  reps: number            // target reps per set
  startingWeight: number  // lbs (0 for bodyweight, bands use resistanceLevel)
  startingResistance?: ResistanceLevel
  restSeconds: number
  notes?: string
}

export interface ProgramDay {
  id: string              // e.g. "w1d1"
  week: number            // 1–8
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0=Sun, 1=Mon ... 6=Sat
  dayType: DayType
  name: string
  estimatedMinutes: number
  exercises: ProgramExercise[]
  equipment: Equipment[]
}

// ─── Session (logged workout) ─────────────────────────────────────────────────

export interface LoggedSet {
  setNumber: number
  targetReps: number
  completedReps: number
  weight: number          // lbs actually used
  resistanceLevel?: ResistanceLevel
  completed: boolean
  skipped?: boolean
}

export interface LoggedExercise {
  exerciseId: string
  sets: LoggedSet[]
  skipped?: boolean
  swappedFrom?: string    // original exerciseId if swapped
}

export interface WorkoutSession {
  id: string
  date: string            // ISO date string YYYY-MM-DD
  programDayId: string
  startTime: number       // epoch ms
  endTime?: number        // epoch ms
  exercises: LoggedExercise[]
  notes?: string
  completed: boolean
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface ExerciseProgress {
  exerciseId: string
  date: string            // YYYY-MM-DD
  weight: number
  reps: number
  isPR: boolean
}

// ─── User Stats ───────────────────────────────────────────────────────────────

export interface UserStats {
  currentStreak: number
  longestStreak: number
  lastWorkoutDate: string | null    // YYYY-MM-DD
  totalSessions: number
  currentProgramWeek: number        // 1–8
  programStartDate: string | null   // YYYY-MM-DD
}

// ─── Overload State ───────────────────────────────────────────────────────────

export interface OverloadState {
  exerciseId: string
  nextWeight: number
  nextResistance?: ResistanceLevel
  lastUpdated: string     // YYYY-MM-DD
}
