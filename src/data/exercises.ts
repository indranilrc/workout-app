import type { Exercise } from '../types'

export const exercises: Exercise[] = [
  // ─── HOME — PUSH (chest, shoulders, triceps) ──────────────────────────────
  {
    id: 'db-bench-press',
    name: 'Dumbbell Bench Press',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['dumbbell', 'bench'],
    notes: 'Lower dumbbells to chest level, press up and slightly inward.',
  },
  {
    id: 'db-incline-press',
    name: 'Dumbbell Incline Press',
    muscleGroups: ['chest', 'shoulders'],
    equipment: ['dumbbell', 'bench'],
    notes: 'Set bench to ~30–45°. Press in a slight arc.',
  },
  {
    id: 'db-shoulder-press',
    name: 'Dumbbell Shoulder Press',
    muscleGroups: ['shoulders', 'triceps'],
    equipment: ['dumbbell'],
    notes: 'Press directly overhead. Keep core tight.',
  },
  {
    id: 'db-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbell'],
    notes: 'Slight bend in elbow. Raise to shoulder height only.',
  },
  {
    id: 'band-chest-press',
    name: 'Resistance Band Chest Press',
    muscleGroups: ['chest', 'triceps'],
    equipment: ['band-handle'],
    notes: 'Anchor band behind you at chest height. Press forward.',
  },
  {
    id: 'db-tricep-kickback',
    name: 'Dumbbell Tricep Kickback',
    muscleGroups: ['triceps'],
    equipment: ['dumbbell', 'bench'],
    notes: 'Hinge forward, upper arm parallel to floor. Extend fully.',
  },
  {
    id: 'pushup',
    name: 'Push-Up',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['bodyweight'],
    notes: 'Body in straight line. Chest nearly touches floor.',
  },

  // ─── HOME — PULL (back, biceps) ───────────────────────────────────────────
  {
    id: 'db-bent-row',
    name: 'Dumbbell Bent-Over Row',
    muscleGroups: ['back', 'biceps'],
    equipment: ['dumbbell'],
    notes: 'Hinge at hips ~45°. Pull to hip, not chest.',
  },
  {
    id: 'db-single-row',
    name: 'Single-Arm Dumbbell Row',
    muscleGroups: ['back', 'biceps'],
    equipment: ['dumbbell', 'bench'],
    notes: 'Brace on bench. Pull elbow past your hip.',
  },
  {
    id: 'band-pull-apart',
    name: 'Band Pull-Apart',
    muscleGroups: ['back', 'shoulders'],
    equipment: ['band-handle'],
    notes: 'Arms straight. Pull band to chest, squeeze shoulder blades.',
  },
  {
    id: 'band-row',
    name: 'Resistance Band Row',
    muscleGroups: ['back', 'biceps'],
    equipment: ['band-handle'],
    notes: 'Anchor band in front. Sit or stand, pull to waist.',
  },
  {
    id: 'db-bicep-curl',
    name: 'Dumbbell Bicep Curl',
    muscleGroups: ['biceps'],
    equipment: ['dumbbell'],
    notes: 'Keep elbows at your sides. Full range of motion.',
  },
  {
    id: 'band-bicep-curl',
    name: 'Band Bicep Curl',
    muscleGroups: ['biceps'],
    equipment: ['band-loop'],
    notes: 'Stand on band. Curl up, control on the way down.',
  },

  // ─── HOME — LOWER BODY ───────────────────────────────────────────────────
  {
    id: 'db-goblet-squat',
    name: 'Goblet Squat',
    muscleGroups: ['quads', 'glutes'],
    equipment: ['dumbbell'],
    notes: 'Hold dumbbell at chest. Sit between your heels.',
  },
  {
    id: 'db-rdl',
    name: 'Dumbbell Romanian Deadlift',
    muscleGroups: ['hamstrings', 'glutes'],
    equipment: ['dumbbell'],
    notes: 'Hinge at hips, slight knee bend. Feel stretch in hamstrings.',
  },
  {
    id: 'db-reverse-lunge',
    name: 'Dumbbell Reverse Lunge',
    muscleGroups: ['quads', 'glutes'],
    equipment: ['dumbbell'],
    notes: 'Step back, lower knee near floor. Keep torso upright.',
  },
  {
    id: 'band-loop-squat',
    name: 'Banded Squat',
    muscleGroups: ['quads', 'glutes'],
    equipment: ['band-loop'],
    notes: 'Loop band above knees. Push knees out against band throughout.',
  },
  {
    id: 'band-glute-bridge',
    name: 'Banded Glute Bridge',
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: ['band-loop', 'mat'],
    notes: 'Band above knees. Drive hips up, squeeze glutes at top.',
  },
  {
    id: 'db-calf-raise',
    name: 'Dumbbell Calf Raise',
    muscleGroups: ['calves'],
    equipment: ['dumbbell'],
    notes: 'Rise onto balls of feet. Full range, slow eccentric.',
  },
  {
    id: 'step-up',
    name: 'Step-Up (Bench)',
    muscleGroups: ['quads', 'glutes'],
    equipment: ['dumbbell', 'bench'],
    notes: 'Drive through heel of the working leg. Control descent.',
  },

  // ─── HOME — CORE ─────────────────────────────────────────────────────────
  {
    id: 'plank',
    name: 'Plank',
    muscleGroups: ['core'],
    equipment: ['mat'],
    notes: 'Elbows under shoulders. Squeeze glutes. Don\'t let hips sag.',
    isCardio: false,
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    muscleGroups: ['core'],
    equipment: ['mat'],
    notes: 'Lower back pressed flat. Extend opposite arm/leg simultaneously.',
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunch',
    muscleGroups: ['core'],
    equipment: ['mat'],
    notes: 'Slow and controlled. Don\'t pull on neck.',
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    muscleGroups: ['core'],
    equipment: ['dumbbell', 'mat'],
    notes: 'Lean back slightly. Rotate through your torso.',
  },

  // ─── HOME — CARDIO ────────────────────────────────────────────────────────
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    muscleGroups: ['cardio', 'calves'],
    equipment: ['jump-rope'],
    notes: 'Stay on balls of feet. Small jumps.',
    isCardio: true,
  },

  // ─── GYM — LOWER BODY ────────────────────────────────────────────────────
  {
    id: 'barbell-squat',
    name: 'Barbell Back Squat',
    muscleGroups: ['quads', 'glutes', 'core'],
    equipment: ['barbell'],
    notes: 'Bar on traps. Squat until thighs parallel. Drive through heels.',
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroups: ['quads', 'glutes'],
    equipment: ['machine'],
    notes: 'Feet shoulder-width. Lower until 90°. Don\'t lock knees at top.',
  },
  {
    id: 'leg-curl',
    name: 'Lying Leg Curl',
    muscleGroups: ['hamstrings'],
    equipment: ['machine'],
    notes: 'Curl heel to glute. Slow eccentric (3 seconds down).',
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    muscleGroups: ['quads'],
    equipment: ['machine'],
    notes: 'Full extension at top. Controlled descent.',
  },
  {
    id: 'hip-thrust-machine',
    name: 'Hip Thrust (Machine or Smith)',
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: ['machine'],
    notes: 'Drive through heels. Full hip extension. Squeeze at top.',
  },
  {
    id: 'gym-calf-raise',
    name: 'Standing Calf Raise (Machine)',
    muscleGroups: ['calves'],
    equipment: ['machine'],
    notes: 'Full range of motion. Pause at top and bottom.',
  },

  // ─── GYM — UPPER PULL ────────────────────────────────────────────────────
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroups: ['back', 'biceps'],
    equipment: ['cable'],
    notes: 'Pull bar to upper chest. Lean back slightly. Squeeze lats.',
  },
  {
    id: 'cable-row',
    name: 'Seated Cable Row',
    muscleGroups: ['back', 'biceps'],
    equipment: ['cable'],
    notes: 'Pull to waist. Keep back straight. Squeeze shoulder blades.',
  },
  {
    id: 'cable-face-pull',
    name: 'Cable Face Pull',
    muscleGroups: ['shoulders', 'back'],
    equipment: ['cable'],
    notes: 'Set cable at face height. Pull to forehead, elbows high.',
  },
  {
    id: 'barbell-row',
    name: 'Barbell Bent-Over Row',
    muscleGroups: ['back', 'biceps'],
    equipment: ['barbell'],
    notes: 'Hinge 45°+. Pull bar to belly button. Squeeze at top.',
  },

  // ─── GYM — UPPER PUSH ────────────────────────────────────────────────────
  {
    id: 'barbell-bench',
    name: 'Barbell Bench Press',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['barbell', 'bench'],
    notes: 'Retract shoulder blades. Bar to lower chest. Feet flat.',
  },
  {
    id: 'cable-chest-fly',
    name: 'Cable Chest Fly',
    muscleGroups: ['chest'],
    equipment: ['cable'],
    notes: 'Arms wide, slight bend. Squeeze hands together at center.',
  },
  {
    id: 'overhead-press',
    name: 'Barbell Overhead Press',
    muscleGroups: ['shoulders', 'triceps'],
    equipment: ['barbell'],
    notes: 'Press directly overhead. Bar clears chin, tuck chin slightly.',
  },
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown (Cable)',
    muscleGroups: ['triceps'],
    equipment: ['cable'],
    notes: 'Elbows at sides. Full extension. Squeeze at bottom.',
  },

  // ─── GYM — FULL BODY / ATHLETIC ──────────────────────────────────────────
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    muscleGroups: ['hamstrings', 'glutes', 'back', 'full-body'],
    equipment: ['barbell'],
    notes: 'Bar over mid-foot. Hinge and push floor away. Lock hips at top.',
  },
  {
    id: 'gym-row-machine',
    name: 'Rowing Machine',
    muscleGroups: ['cardio', 'full-body'],
    equipment: ['cardio-machine'],
    notes: 'Drive legs first, then lean back, then pull arms. Ratio: 60% legs.',
    isCardio: true,
  },
  {
    id: 'battle-ropes',
    name: 'Battle Ropes',
    muscleGroups: ['cardio', 'shoulders', 'core'],
    equipment: ['machine'],
    notes: 'Alternate arms. Stay in slight squat. Keep intensity high.',
    isCardio: true,
  },
]

export const exerciseMap = Object.fromEntries(exercises.map(e => [e.id, e]))
