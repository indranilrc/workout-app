import type { ProgramDay } from '../types'

// SJ's program — fully home-based
// Mon: HIIT + Core | Tue: Upper Body | Wed: Yoga & Mobility
// Thu: Lower Body  | Fri: Full Body Circuit | Sat/Sun: Walk/Hike
//
// Equipment: bodyweight, green loop bands (light), mat, jump rope, bench
// Phase 1 (Wks 1–4): Foundation — 3 sets, moderate reps
// Phase 2 (Wks 5–8): Progression — 3–4 sets, higher reps / intensity
// Deload: Weeks 4 & 8 (drop to 2 sets)

function dayId(week: number, dayOfWeek: number) {
  return `sj-w${week}d${dayOfWeek}`
}

type WeekConfig = { sets: number; isDeload?: boolean }

// ─── Monday: HIIT + Core ─────────────────────────────────────────────────────

function hiitCore({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? 2 : sets
  return [
    { exerciseId: 'jumping-jack',    sets: 1, reps: 30, startingWeight: 0, restSeconds: 30, notes: 'Warm-up' },
    { exerciseId: 'high-knees',      sets: s, reps: 20, startingWeight: 0, restSeconds: 30, notes: '20 per leg' },
    { exerciseId: 'jump-squat',      sets: s, reps: 12, startingWeight: 0, restSeconds: 45 },
    { exerciseId: 'mountain-climber',sets: s, reps: 20, startingWeight: 0, restSeconds: 30, notes: '20 per leg' },
    { exerciseId: 'burpee',          sets: s, reps: 8,  startingWeight: 0, restSeconds: 60 },
    { exerciseId: 'jump-rope',       sets: 1, reps: 0,  startingWeight: 0, restSeconds: 30, notes: '2 min steady' },
    { exerciseId: 'plank',           sets: s, reps: 0,  startingWeight: 0, restSeconds: 45, notes: '30 sec hold' },
    { exerciseId: 'bicycle-crunch',  sets: s, reps: 20, startingWeight: 0, restSeconds: 30 },
    { exerciseId: 'dead-bug',        sets: s, reps: 10, startingWeight: 0, restSeconds: 30 },
  ]
}

// ─── Tuesday: Upper Body ─────────────────────────────────────────────────────

function upperBody({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? 2 : sets
  return [
    { exerciseId: 'inchworm',       sets: 1, reps: 6,  startingWeight: 0, restSeconds: 30, notes: 'Warm-up' },
    { exerciseId: 'pushup',         sets: s, reps: 10, startingWeight: 0, restSeconds: 60 },
    { exerciseId: 'band-row',       sets: s, reps: 12, startingWeight: 0, startingResistance: 'light', restSeconds: 60 },
    { exerciseId: 'band-pull-apart',sets: s, reps: 15, startingWeight: 0, startingResistance: 'light', restSeconds: 45 },
    { exerciseId: 'band-bicep-curl',sets: s, reps: 12, startingWeight: 0, startingResistance: 'light', restSeconds: 45 },
    { exerciseId: 'tricep-dip',     sets: s, reps: 10, startingWeight: 0, restSeconds: 45 },
    { exerciseId: 'band-chest-press',sets: s, reps: 12, startingWeight: 0, startingResistance: 'light', restSeconds: 60 },
    { exerciseId: 'plank',          sets: 2, reps: 0,  startingWeight: 0, restSeconds: 30, notes: '30 sec hold' },
  ]
}

// ─── Wednesday: Yoga & Mobility ──────────────────────────────────────────────

function yogaMobility(): ProgramDay['exercises'] {
  return [
    { exerciseId: 'yoga-cat-cow',      sets: 1, reps: 0, startingWeight: 0, restSeconds: 15, notes: '10 slow breaths' },
    { exerciseId: 'yoga-downward-dog', sets: 1, reps: 0, startingWeight: 0, restSeconds: 15, notes: 'Hold 30 sec, pedal feet' },
    { exerciseId: 'yoga-cobra',        sets: 2, reps: 0, startingWeight: 0, restSeconds: 15, notes: 'Hold 20 sec each' },
    { exerciseId: 'yoga-warrior-1',    sets: 1, reps: 0, startingWeight: 0, restSeconds: 15, notes: 'Hold 30 sec each side' },
    { exerciseId: 'yoga-warrior-2',    sets: 1, reps: 0, startingWeight: 0, restSeconds: 15, notes: 'Hold 30 sec each side' },
    { exerciseId: 'yoga-pigeon',       sets: 1, reps: 0, startingWeight: 0, restSeconds: 15, notes: 'Hold 45 sec each side' },
    { exerciseId: 'yoga-bridge',       sets: 2, reps: 0, startingWeight: 0, restSeconds: 20, notes: 'Hold 30 sec or 15 pulses' },
    { exerciseId: 'yoga-forward-fold', sets: 1, reps: 0, startingWeight: 0, restSeconds: 15, notes: 'Hold 45 sec' },
    { exerciseId: 'yoga-supine-twist', sets: 1, reps: 0, startingWeight: 0, restSeconds: 15, notes: 'Hold 30 sec each side' },
    { exerciseId: 'yoga-child-pose',   sets: 1, reps: 0, startingWeight: 0, restSeconds: 0,  notes: 'Hold 60 sec — breathe' },
  ]
}

// ─── Thursday: Lower Body ────────────────────────────────────────────────────

function lowerBody({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? 2 : sets
  return [
    { exerciseId: 'jumping-jack',    sets: 1, reps: 20, startingWeight: 0, restSeconds: 30, notes: 'Warm-up' },
    { exerciseId: 'band-loop-squat', sets: s, reps: 15, startingWeight: 0, startingResistance: 'light', restSeconds: 45 },
    { exerciseId: 'sumo-squat',      sets: s, reps: 15, startingWeight: 0, restSeconds: 45 },
    { exerciseId: 'band-glute-bridge',sets: s, reps: 15, startingWeight: 0, startingResistance: 'light', restSeconds: 45 },
    { exerciseId: 'clamshell',       sets: s, reps: 15, startingWeight: 0, startingResistance: 'light', restSeconds: 30, notes: '15 per side' },
    { exerciseId: 'donkey-kick',     sets: s, reps: 12, startingWeight: 0, startingResistance: 'light', restSeconds: 30, notes: '12 per leg' },
    { exerciseId: 'fire-hydrant',    sets: s, reps: 12, startingWeight: 0, startingResistance: 'light', restSeconds: 30, notes: '12 per leg' },
    { exerciseId: 'side-lunge',      sets: s, reps: 10, startingWeight: 0, restSeconds: 45, notes: '10 per side' },
    { exerciseId: 'db-calf-raise',   sets: s, reps: 15, startingWeight: 0, restSeconds: 30 },
    { exerciseId: 'russian-twist',   sets: 2, reps: 20, startingWeight: 0, restSeconds: 30 },
  ]
}

// ─── Friday: Full Body Circuit ────────────────────────────────────────────────

function fullBodyCircuit({ sets, isDeload }: WeekConfig): ProgramDay['exercises'] {
  const s = isDeload ? 2 : sets
  return [
    { exerciseId: 'jump-rope',       sets: 1, reps: 0,  startingWeight: 0, restSeconds: 30, notes: '3 min warm-up' },
    { exerciseId: 'burpee',          sets: s, reps: 8,  startingWeight: 0, restSeconds: 45 },
    { exerciseId: 'pushup',          sets: s, reps: 10, startingWeight: 0, restSeconds: 30 },
    { exerciseId: 'jump-squat',      sets: s, reps: 12, startingWeight: 0, restSeconds: 30 },
    { exerciseId: 'band-row',        sets: s, reps: 12, startingWeight: 0, startingResistance: 'light', restSeconds: 30 },
    { exerciseId: 'mountain-climber',sets: s, reps: 20, startingWeight: 0, restSeconds: 30, notes: '20 per leg' },
    { exerciseId: 'hip-circle',      sets: s, reps: 10, startingWeight: 0, startingResistance: 'light', restSeconds: 30, notes: '10 per leg' },
    { exerciseId: 'plank',           sets: 2, reps: 0,  startingWeight: 0, restSeconds: 30, notes: '40 sec hold' },
    { exerciseId: 'yoga-child-pose', sets: 1, reps: 0,  startingWeight: 0, restSeconds: 0,  notes: 'Cool-down — 60 sec' },
  ]
}

// ─── Build weeks ──────────────────────────────────────────────────────────────

function buildWeek(week: number): ProgramDay[] {
  const isDeload = week === 4 || week === 8
  const phase2 = week >= 5
  const sets = isDeload ? 2 : phase2 ? 4 : 3

  return [
    {
      id: dayId(week, 1),
      week,
      dayOfWeek: 1,
      dayType: 'home',
      name: 'HIIT + Core',
      estimatedMinutes: 35,
      equipment: ['bodyweight', 'jump-rope', 'mat'],
      exercises: hiitCore({ sets, isDeload }),
    },
    {
      id: dayId(week, 2),
      week,
      dayOfWeek: 2,
      dayType: 'home',
      name: 'Upper Body',
      estimatedMinutes: 35,
      equipment: ['bodyweight', 'band-loop', 'band-handle', 'bench', 'mat'],
      exercises: upperBody({ sets, isDeload }),
    },
    {
      id: dayId(week, 3),
      week,
      dayOfWeek: 3,
      dayType: 'home',
      name: 'Yoga & Mobility',
      estimatedMinutes: 30,
      equipment: ['mat'],
      exercises: yogaMobility(),
    },
    {
      id: dayId(week, 4),
      week,
      dayOfWeek: 4,
      dayType: 'home',
      name: 'Lower Body',
      estimatedMinutes: 40,
      equipment: ['bodyweight', 'band-loop', 'mat'],
      exercises: lowerBody({ sets, isDeload }),
    },
    {
      id: dayId(week, 5),
      week,
      dayOfWeek: 5,
      dayType: 'home',
      name: 'Full Body Circuit',
      estimatedMinutes: 35,
      equipment: ['bodyweight', 'band-loop', 'band-handle', 'jump-rope', 'mat'],
      exercises: fullBodyCircuit({ sets, isDeload }),
    },
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

export const programSJ: ProgramDay[] = Array.from({ length: 8 }, (_, i) =>
  buildWeek(i + 1)
).flat()

export const programDayMapSJ = Object.fromEntries(programSJ.map(d => [d.id, d]))
