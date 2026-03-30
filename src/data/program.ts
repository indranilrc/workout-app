import type { ProgramDay } from '../types'

// ─── Rest times ───────────────────────────────────────────────────────────────
// Home = 60s, Gym = 90s, Compound gym = 120s

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dayId(week: number, dayOfWeek: number) {
  return `w${week}d${dayOfWeek}`
}

// ─── Week template builders ───────────────────────────────────────────────────
// Phase 1 (Weeks 1–4): Foundation — moderate volume, form focus
// Phase 2 (Weeks 5–8): Progression — more volume/intensity
// Week 4 & 8: Deload (reduced sets)

type WeekConfig = { sets: number; isDeload?: boolean }

function homeUpperPush({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? Math.max(2, sets - 1) : sets
  return [
    { exerciseId: 'jump-rope',        sets: 1, reps: 0, startingWeight: 0, restSeconds: 30, notes: '3 min warm-up' },
    { exerciseId: 'db-bench-press',   sets: s, reps: 10, startingWeight: 25, restSeconds: 60 },
    { exerciseId: 'db-incline-press', sets: s, reps: 10, startingWeight: 20, restSeconds: 60 },
    { exerciseId: 'db-shoulder-press',sets: s, reps: 12, startingWeight: 20, restSeconds: 60 },
    { exerciseId: 'db-lateral-raise', sets: s, reps: 15, startingWeight: 10, restSeconds: 45 },
    { exerciseId: 'db-tricep-kickback',sets: s, reps: 12, startingWeight: 15, restSeconds: 45 },
    { exerciseId: 'plank',            sets: 2, reps: 0,  startingWeight: 0,  restSeconds: 45, notes: '30 sec hold' },
  ]
}

function gymLower({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? Math.max(2, sets - 1) : sets
  return [
    { exerciseId: 'barbell-squat',    sets: s, reps: 8,  startingWeight: 95,  restSeconds: 120 },
    { exerciseId: 'leg-press',        sets: s, reps: 10, startingWeight: 180, restSeconds: 90 },
    { exerciseId: 'leg-curl',         sets: s, reps: 12, startingWeight: 50,  restSeconds: 60 },
    { exerciseId: 'hip-thrust-machine',sets: s, reps: 12, startingWeight: 90, restSeconds: 90 },
    { exerciseId: 'gym-calf-raise',   sets: s, reps: 15, startingWeight: 100, restSeconds: 45 },
    { exerciseId: 'dead-bug',         sets: 2, reps: 10, startingWeight: 0,   restSeconds: 45 },
  ]
}

function gymUpperPull({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? Math.max(2, sets - 1) : sets
  return [
    { exerciseId: 'lat-pulldown',     sets: s, reps: 10, startingWeight: 80,  restSeconds: 90 },
    { exerciseId: 'cable-row',        sets: s, reps: 10, startingWeight: 70,  restSeconds: 90 },
    { exerciseId: 'barbell-row',      sets: s, reps: 10, startingWeight: 85,  restSeconds: 90 },
    { exerciseId: 'cable-face-pull',  sets: s, reps: 15, startingWeight: 30,  restSeconds: 45 },
    { exerciseId: 'db-bicep-curl',    sets: s, reps: 12, startingWeight: 20,  restSeconds: 45 },
    { exerciseId: 'bicycle-crunch',   sets: 2, reps: 20, startingWeight: 0,   restSeconds: 30 },
  ]
}

function gymFullBody({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? Math.max(2, sets - 1) : sets
  return [
    { exerciseId: 'deadlift',         sets: s, reps: 6,  startingWeight: 115, restSeconds: 120 },
    { exerciseId: 'overhead-press',   sets: s, reps: 8,  startingWeight: 65,  restSeconds: 90 },
    { exerciseId: 'cable-chest-fly',  sets: s, reps: 12, startingWeight: 25,  restSeconds: 60 },
    { exerciseId: 'tricep-pushdown',  sets: s, reps: 12, startingWeight: 40,  restSeconds: 60 },
    { exerciseId: 'gym-row-machine',  sets: 1, reps: 0,  startingWeight: 0,   restSeconds: 60, notes: '5 min steady pace' },
    { exerciseId: 'plank',            sets: 2, reps: 0,  startingWeight: 0,   restSeconds: 45, notes: '40 sec hold' },
  ]
}

function homeLower({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? Math.max(2, sets - 1) : sets
  return [
    { exerciseId: 'jump-rope',        sets: 1, reps: 0,  startingWeight: 0,  restSeconds: 30, notes: '3 min warm-up' },
    { exerciseId: 'db-goblet-squat',  sets: s, reps: 12, startingWeight: 30, restSeconds: 60 },
    { exerciseId: 'db-rdl',           sets: s, reps: 10, startingWeight: 30, restSeconds: 60 },
    { exerciseId: 'db-reverse-lunge', sets: s, reps: 10, startingWeight: 20, restSeconds: 60, notes: '10 per leg' },
    { exerciseId: 'band-glute-bridge',sets: s, reps: 15, startingWeight: 0,  startingResistance: 'medium', restSeconds: 45 },
    { exerciseId: 'step-up',          sets: s, reps: 10, startingWeight: 15, restSeconds: 60, notes: '10 per leg' },
    { exerciseId: 'db-calf-raise',    sets: s, reps: 15, startingWeight: 25, restSeconds: 30 },
    { exerciseId: 'russian-twist',    sets: 2, reps: 20, startingWeight: 10, restSeconds: 30 },
  ]
}

// ─── Build weeks ──────────────────────────────────────────────────────────────

function buildWeek(week: number): ProgramDay[] {
  const isDeload = week === 4 || week === 8
  const phase2 = week >= 5
  const sets = isDeload ? 2 : phase2 ? 4 : 3

  return [
    // Monday — home upper push (dayOfWeek 1)
    {
      id: dayId(week, 1),
      week,
      dayOfWeek: 1,
      dayType: 'home',
      name: 'Upper Body — Push',
      estimatedMinutes: 35,
      equipment: ['dumbbell', 'bench', 'jump-rope', 'mat'],
      exercises: homeUpperPush({ sets, isDeload }),
    },
    // Tuesday — gym lower (dayOfWeek 2)
    {
      id: dayId(week, 2),
      week,
      dayOfWeek: 2,
      dayType: 'gym',
      name: 'Lower Body + Core',
      estimatedMinutes: 40,
      equipment: ['barbell', 'machine'],
      exercises: gymLower({ sets, isDeload }),
    },
    // Wednesday — gym upper pull (dayOfWeek 3)
    {
      id: dayId(week, 3),
      week,
      dayOfWeek: 3,
      dayType: 'gym',
      name: 'Upper Body — Pull',
      estimatedMinutes: 40,
      equipment: ['cable', 'barbell'],
      exercises: gymUpperPull({ sets, isDeload }),
    },
    // Thursday — gym full body (dayOfWeek 4)
    {
      id: dayId(week, 4),
      week,
      dayOfWeek: 4,
      dayType: 'gym',
      name: 'Full Body + Conditioning',
      estimatedMinutes: 45,
      equipment: ['barbell', 'cable', 'cardio-machine'],
      exercises: gymFullBody({ sets, isDeload }),
    },
    // Friday — home lower (dayOfWeek 5)
    {
      id: dayId(week, 5),
      week,
      dayOfWeek: 5,
      dayType: 'home',
      name: 'Lower Body + Core',
      estimatedMinutes: 40,
      equipment: ['dumbbell', 'band-loop', 'bench', 'jump-rope', 'mat'],
      exercises: homeLower({ sets, isDeload }),
    },
    // Saturday — walk/hike (dayOfWeek 6)
    {
      id: dayId(week, 6),
      week,
      dayOfWeek: 6,
      dayType: 'walk',
      name: 'Walk / Hike',
      estimatedMinutes: 45,
      equipment: [],
      exercises: [],
    },
    // Sunday — walk/hike (dayOfWeek 0)
    {
      id: dayId(week, 0),
      week,
      dayOfWeek: 0,
      dayType: 'walk',
      name: 'Walk / Hike',
      estimatedMinutes: 45,
      equipment: [],
      exercises: [],
    },
  ]
}

// ─── Full 8-week program ──────────────────────────────────────────────────────

export const program: ProgramDay[] = Array.from({ length: 8 }, (_, i) =>
  buildWeek(i + 1)
).flat()

// Lookup helpers
export const programDayMap = Object.fromEntries(program.map(d => [d.id, d]))

export function getProgramDay(week: number, dayOfWeek: number): ProgramDay | undefined {
  return programDayMap[dayId(week, dayOfWeek)]
}

export function getTodaysProgramDay(
  _programStartDate: string,
  currentProgramWeek: number
): ProgramDay | undefined {
  const today = new Date()
  const dow = today.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
  return getProgramDay(currentProgramWeek, dow)
}
