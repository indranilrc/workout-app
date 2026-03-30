# Workout PWA — Design Spec
**Date:** 2026-03-29
**Author:** Indranil Roy Choudhury
**GitHub:** github.com/indranilrc

---

## Overview

A progressive web app (PWA) for daily workout tracking and guidance. Designed for someone with intermediate fitness experience targeting weight loss, muscle building, and general fitness. The app removes decision fatigue by providing a pre-built hybrid program and guiding the user through each session step-by-step.

Deployed on GitHub Pages, installable on Android via Chrome's "Add to Home Screen."

---

## Goals

- Eliminate daily decisions: the app tells you exactly what to do
- Build a consistent habit through streak tracking and progress visibility
- Automatically progress workouts over time (progressive overload)
- Work fully offline once installed on Android
- No backend, no accounts — all data on-device

---

## Equipment Available

**Home:**
- Adjustable dumbbells
- Exercise bands with handles
- Resistance bands (loop)
- Workout bench
- Exercise mat
- Jump ropes

**Gym (work access — Tue/Wed/Thu):**
- Full gym equipment: machines, cables, barbells, etc.

---

## Weekly Schedule

| Day | Location | Focus |
|-----|----------|-------|
| Monday | Home | Upper Body — Push (dumbbells, bands) |
| Tuesday | Gym | Lower Body + Core |
| Wednesday | Gym | Upper Body — Pull (cables, rows) |
| Thursday | Gym | Full Body / Athletic (compound + conditioning) |
| Friday | Home | Lower Body + Core (dumbbells, bands, mat) |
| Saturday | Outdoor | Walk / Hike (logged, not guided) |
| Sunday | Outdoor | Walk / Hike (logged, not guided) |

Session duration: 30–45 minutes.

---

## Program Structure

### Phase-based, 8-week program

**Phase 1 — Foundation (Weeks 1–4):**
- Learn movements, establish baseline weights
- Lower intensity, focus on form

**Phase 2 — Progression (Weeks 5–8):**
- Heavier weights, slightly more volume
- Same movement patterns, increased load

**Deload (Week 4 and Week 8):**
- Reduce volume ~40% to allow recovery
- Same exercises, fewer sets

**After Week 8:**
- Program resets at a higher baseline or advances to Phase 2 (next program block)

### Progressive Overload Logic

- If all prescribed reps completed across all sets → add weight next session (+2.5 lbs for dumbbells, +1 resistance level for bands)
- If any set is failed → weight stays the same next session
- Overload is tracked per exercise, per user

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React 18 + TypeScript | Component model suits complex session flow |
| Build tool | Vite | Fast dev experience, excellent PWA plugin |
| PWA | vite-plugin-pwa | Service worker, offline, installable |
| State | Zustand | Lightweight, sufficient for session/streak state |
| Persistence | IndexedDB (via `idb`) | Structured local storage for workout history |
| Styling | Tailwind CSS | Mobile-first, fast to build |
| Deployment | GitHub Pages | Free, always on, works with Android PWA install |
| CI/CD | GitHub Actions | Auto-deploy on push to `main` |

**No backend. No authentication. All data lives on the device.**

---

## Application Views

### 1. Home Screen

- **Today's Workout card:** workout name, day label, estimated duration, equipment needed, big "Start" button
- If workout already completed: checkmark + session summary
- **Streak tracker:** flame icon + count, Mon–Sun weekly dots (filled = done), weekends show walk/hike indicator separately
- **Progress snapshot:** 3 key lifts with trend arrow (e.g., "Dumbbell Press ↑ 35 lbs")
- **Motivational text:** context-aware message (new streak, missed day, new PR, etc.)

### 2. Workout Session

**Overview screen (before starting):**
- Workout name, estimated time, equipment list
- Full exercise list: exercise name, sets × reps, pre-filled weight (last session + overload applied)
- "Start Workout" button

**Guided exercise flow:**
1. Exercise card: name, target muscle group, sets × reps, weight to use
2. Animated GIF or SVG illustration for form reference
3. Inline set logging: tap to confirm reps, adjust weight if needed
4. After last set: rest timer starts automatically (60s home / 90s gym, configurable)
5. Timer complete → next exercise loads
6. Progress bar at top throughout

**Completion screen:**
- Total time, exercises completed
- Personal records achieved (highlighted)
- Streak updated
- Optional session note

**Edge cases:**
- Skip exercise (session continues, skipped exercise noted)
- Swap exercise (substitute from same muscle group)
- App closed mid-session: resumes where left off on reopen

### 3. History

- Sessions list, newest first
- Each entry: date, workout name, duration, completion status
- Tap to expand: full set/rep/weight log
- Per-exercise progress chart (line chart, weight over time, PRs marked)

### 4. Program View

- Full 8-week program visible
- Current week/day highlighted
- Each day shows exercise list (read-only overview)

---

## Data Model (IndexedDB)

```
workoutProgram[]
  - id, week, day, dayType (home/gym/walk), exercises[]

exercise
  - id, name, muscleGroup, equipment, demoUrl

session
  - id, date, programDayId, startTime, endTime, notes
  - sets[]: { exerciseId, setNumber, targetReps, completedReps, weight, completed }

progressRecord
  - exerciseId, date, weight, reps (used for overload calculation and charting)

userStats
  - currentStreak, longestStreak, lastWorkoutDate, totalSessions
```

---

## Progressive Overload Algorithm

```
for each exercise in completed session:
  if all sets completed with targetReps or more:
    nextWeight[exerciseId] = currentWeight + increment
  else:
    nextWeight[exerciseId] = currentWeight

increment:
  dumbbells: +2.5 lbs
  bands: +1 resistance level (tracked as ordinal: light / medium / heavy / x-heavy)
  gym machines/barbell: +5 lbs
```

---

## Streak Logic

- Weekday workout completed → streak increments
- Walk/hike logged on weekend → counts as a separate "active day" (does not break or pad workout streak)
- Missed weekday → streak resets to 0
- Lifetime stats (total sessions, longest streak) are never reset

---

## Deployment

- **Repo:** github.com/indranilrc/workout-app (or similar)
- **GitHub Actions:** on push to `main` → `npm run build` → deploy `dist/` to `gh-pages` branch
- **Domain:** `indranilrc.github.io/workout-app`
- **Android install:** Chrome → "Add to Home Screen" → launches as standalone app with no browser UI

---

## Out of Scope (for now)

- Push notifications
- Cloud sync / backup
- Social / sharing features
- Custom program builder
- Nutrition tracking
- Video demos (animated GIFs/SVGs only for now)
