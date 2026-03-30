import { create } from 'zustand'
import type {
  WorkoutSession,
  LoggedExercise,
  LoggedSet,
  ProgramDay,
} from '../types'
import { saveSession, getOverload, saveOverload, getAllOverloads } from '../db'
import { computeOverload } from '../utils/overload'
import { todayISO } from '../utils/dates'

interface SessionState {
  session: WorkoutSession | null
  activeExerciseIndex: number
  activeSetIndex: number
  phase: 'idle' | 'overview' | 'exercise' | 'rest' | 'complete'
  overloads: Record<string, { weight: number; resistance?: string }>

  loadOverloads: () => Promise<void>
  startSession: (day: ProgramDay) => void
  startExercise: (index: number) => void
  logSet: (reps: number, weight: number) => void
  skipSet: () => void
  skipExercise: () => void
  endRest: () => void
  finishSession: (notes?: string) => Promise<void>
  abandonSession: () => void
  getNextWeight: (exerciseId: string, defaultWeight: number) => number
}

function buildInitialExercises(day: ProgramDay, overloads: SessionState['overloads']): LoggedExercise[] {
  return day.exercises.map(pe => ({
    exerciseId: pe.exerciseId,
    sets: Array.from({ length: pe.sets }, (_, i) => ({
      setNumber: i + 1,
      targetReps: pe.reps,
      completedReps: 0,
      weight: overloads[pe.exerciseId]?.weight ?? pe.startingWeight,
      resistanceLevel: (overloads[pe.exerciseId]?.resistance ?? pe.startingResistance) as LoggedSet['resistanceLevel'],
      completed: false,
    })),
  }))
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,
  activeExerciseIndex: 0,
  activeSetIndex: 0,
  phase: 'idle',
  overloads: {},

  loadOverloads: async () => {
    const all = await getAllOverloads()
    const map: SessionState['overloads'] = {}
    all.forEach(o => {
      map[o.exerciseId] = { weight: o.nextWeight, resistance: o.nextResistance }
    })
    set({ overloads: map })
  },

  getNextWeight: (exerciseId, defaultWeight) => {
    const { overloads } = get()
    return overloads[exerciseId]?.weight ?? defaultWeight
  },

  startSession: (day: ProgramDay) => {
    const { overloads } = get()
    const exercises = buildInitialExercises(day, overloads)
    const session: WorkoutSession = {
      id: `${todayISO()}-${day.id}`,
      date: todayISO(),
      programDayId: day.id,
      startTime: Date.now(),
      exercises,
      completed: false,
    }
    set({ session, activeExerciseIndex: 0, activeSetIndex: 0, phase: 'overview' })
  },

  startExercise: (index: number) => {
    set({ activeExerciseIndex: index, activeSetIndex: 0, phase: 'exercise' })
  },

  logSet: (reps: number, weight: number) => {
    const { session, activeExerciseIndex, activeSetIndex } = get()
    if (!session) return

    const exercises = session.exercises.map((ex, ei) => {
      if (ei !== activeExerciseIndex) return ex
      const sets = ex.sets.map((s, si) => {
        if (si !== activeSetIndex) return s
        return { ...s, completedReps: reps, weight, completed: true }
      })
      return { ...ex, sets }
    })

    const updatedSession = { ...session, exercises }
    const exercise = updatedSession.exercises[activeExerciseIndex]
    const isLastSet = activeSetIndex >= exercise.sets.length - 1
    const isLastExercise = activeExerciseIndex >= exercises.length - 1

    if (isLastSet && isLastExercise) {
      set({ session: updatedSession, phase: 'complete' })
    } else if (isLastSet) {
      set({ session: updatedSession, phase: 'rest', activeSetIndex: 0 })
    } else {
      set({ session: updatedSession, phase: 'rest', activeSetIndex: activeSetIndex + 1 })
    }
  },

  skipSet: () => {
    const { session, activeExerciseIndex, activeSetIndex } = get()
    if (!session) return

    const exercises = session.exercises.map((ex, ei) => {
      if (ei !== activeExerciseIndex) return ex
      const sets = ex.sets.map((s, si) => {
        if (si !== activeSetIndex) return s
        return { ...s, skipped: true, completed: false }
      })
      return { ...ex, sets }
    })

    const updatedSession = { ...session, exercises }
    const exercise = updatedSession.exercises[activeExerciseIndex]
    const isLastSet = activeSetIndex >= exercise.sets.length - 1
    const isLastExercise = activeExerciseIndex >= exercises.length - 1

    if (isLastSet && isLastExercise) {
      set({ session: updatedSession, phase: 'complete' })
    } else if (isLastSet) {
      set({ session: updatedSession, phase: 'exercise', activeExerciseIndex: activeExerciseIndex + 1, activeSetIndex: 0 })
    } else {
      set({ session: updatedSession, activeSetIndex: activeSetIndex + 1 })
    }
  },

  skipExercise: () => {
    const { session, activeExerciseIndex } = get()
    if (!session) return

    const exercises = session.exercises.map((ex, ei) => {
      if (ei !== activeExerciseIndex) return ex
      return { ...ex, skipped: true }
    })

    const updatedSession = { ...session, exercises }
    const isLastExercise = activeExerciseIndex >= exercises.length - 1

    if (isLastExercise) {
      set({ session: updatedSession, phase: 'complete' })
    } else {
      set({
        session: updatedSession,
        phase: 'exercise',
        activeExerciseIndex: activeExerciseIndex + 1,
        activeSetIndex: 0,
      })
    }
  },

  endRest: () => {
    const { activeExerciseIndex, activeSetIndex, session } = get()
    if (!session) return

    const currentExercise = session.exercises[activeExerciseIndex]
    const isMovingToNextExercise = activeSetIndex === 0 &&
      currentExercise.sets.every((s, i) => i === 0 || s.completed || s.skipped)

    if (isMovingToNextExercise && activeExerciseIndex < session.exercises.length - 1) {
      set({ phase: 'exercise', activeExerciseIndex: activeExerciseIndex + 1, activeSetIndex: 0 })
    } else {
      set({ phase: 'exercise' })
    }
  },

  finishSession: async (notes?: string) => {
    const { session } = get()
    if (!session) return

    const completed: WorkoutSession = {
      ...session,
      endTime: Date.now(),
      completed: true,
      notes,
    }

    await saveSession(completed)

    // Update overload states for each exercise
    for (const logged of completed.exercises) {
      if (logged.skipped) continue
      const currentOverload = await getOverload(logged.exerciseId)
      const currentWeight = currentOverload?.nextWeight ?? logged.sets[0]?.weight ?? 0
      const currentResistance = currentOverload?.nextResistance
      const newOverload = computeOverload(logged, currentWeight, currentResistance)
      if (newOverload.nextWeight !== undefined) {
        await saveOverload({
          exerciseId: logged.exerciseId,
          nextWeight: newOverload.nextWeight,
          nextResistance: newOverload.nextResistance,
          lastUpdated: todayISO(),
        })
      }
    }

    set({ session: completed, phase: 'complete' })
  },

  abandonSession: () => {
    set({ session: null, phase: 'idle', activeExerciseIndex: 0, activeSetIndex: 0 })
  },
}))
