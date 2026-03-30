import type { LoggedExercise, OverloadState, ResistanceLevel } from '../types'

const RESISTANCE_LEVELS: ResistanceLevel[] = ['light', 'medium', 'heavy', 'x-heavy']

function nextResistance(current: ResistanceLevel): ResistanceLevel {
  const idx = RESISTANCE_LEVELS.indexOf(current)
  return RESISTANCE_LEVELS[Math.min(idx + 1, RESISTANCE_LEVELS.length - 1)]
}

function weightIncrement(exerciseId: string): number {
  // Cardio / bodyweight: no increment
  if (['jump-rope', 'plank', 'dead-bug', 'bicycle-crunch', 'gym-row-machine', 'battle-ropes'].includes(exerciseId)) {
    return 0
  }
  // Barbell compounds: 5 lbs
  if (['barbell-squat', 'deadlift', 'barbell-bench', 'overhead-press', 'barbell-row'].includes(exerciseId)) {
    return 5
  }
  // Machines: 5 lbs
  if (['leg-press', 'leg-curl', 'leg-extension', 'hip-thrust-machine', 'gym-calf-raise',
       'lat-pulldown', 'cable-row', 'cable-face-pull', 'cable-chest-fly', 'tricep-pushdown'].includes(exerciseId)) {
    return 5
  }
  // Dumbbells: 2.5 lbs
  return 2.5
}

/**
 * Given a completed logged exercise, compute the next session's weight/resistance.
 * Returns undefined if no change needed or exercise doesn't track weight.
 */
export function computeOverload(
  logged: LoggedExercise,
  currentWeight: number,
  currentResistance?: ResistanceLevel
): Partial<OverloadState> {
  if (logged.skipped) return {}

  const completedSets = logged.sets.filter(s => !s.skipped)
  if (completedSets.length === 0) return {}

  const allSetsCompleted = completedSets.every(
    s => s.completed && s.completedReps >= s.targetReps
  )

  if (!allSetsCompleted) {
    // Failed at least one set — keep current weight
    return {
      nextWeight: currentWeight,
      nextResistance: currentResistance,
    }
  }

  // All sets completed — increase load
  const increment = weightIncrement(logged.exerciseId)

  if (increment === 0 && currentResistance) {
    // Band exercise — bump resistance level
    return {
      nextWeight: currentWeight,
      nextResistance: nextResistance(currentResistance),
    }
  }

  return {
    nextWeight: currentWeight + increment,
    nextResistance: currentResistance,
  }
}
