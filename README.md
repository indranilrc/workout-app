# Workout App

A progressive web app (PWA) for daily workout tracking and guidance.

**Live:** https://indranilrc.github.io/workout-app/

## Users
- **IRC** (orange) — hybrid home + gym program
- **SJ** (purple) — fully home-based program

Each user has a separate 4-digit PIN and completely isolated data.

## Features
- Pre-built 8-week hybrid program (Mon–Fri)
- Guided session flow: overview → exercise-by-exercise → rest timer → done
- Automatic progressive overload (weight increases when all sets completed)
- Streak tracking and session history
- Per-exercise progress charts
- Fully offline — all data stored on-device (IndexedDB)
- Installable on Android (Chrome) and iPhone (Safari) via Add to Home Screen

## IRC's Program (Mon–Fri)
| Day | Location | Focus |
|-----|----------|-------|
| Mon | Home | Upper Body — Push |
| Tue | Gym | Lower Body + Core |
| Wed | Gym | Upper Body — Pull |
| Thu | Gym | Full Body + Conditioning |
| Fri | Home | Lower Body + Core |
| Sat/Sun | Outdoor | Walk / Hike |

## SJ's Program (Mon–Fri, fully home)
| Day | Focus |
|-----|-------|
| Mon | HIIT + Core |
| Tue | Upper Body (bodyweight + bands) |
| Wed | Yoga & Mobility |
| Thu | Lower Body (bodyweight + bands) |
| Fri | Full Body Circuit |
| Sat/Sun | Walk / Hike |

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (state)
- IndexedDB via `idb` (persistence)
- `vite-plugin-pwa` (offline + installable)
- GitHub Actions → GitHub Pages (CI/CD)

## Local Development
```bash
npm install --legacy-peer-deps
npm run dev
# Open http://localhost:5173/workout-app/
```

## Deployment
Push to `main` — GitHub Actions builds and deploys automatically.
