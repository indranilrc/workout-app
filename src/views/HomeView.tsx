import { useEffect, useState } from 'react'
import { useStatsStore } from '../store/statsStore'
import { useSessionStore } from '../store/sessionStore'
import { getTodaysProgramDay } from '../data/program'
import { getSessionByDate } from '../db'
import { todayISO, formatDuration, dayOfWeekLabel } from '../utils/dates'
import type { ProgramDay, WorkoutSession } from '../types'

interface Props {
  onStartSession: () => void
}

function motivationalText(streak: number, lastWorkoutDate: string | null, todayComplete: boolean): string {
  if (todayComplete) return 'Session done. Rest up.'
  if (!lastWorkoutDate) return 'First session. Let\'s go.'
  if (streak === 0) return 'Back at it. One session at a time.'
  if (streak >= 14) return `${streak} days strong. You\'re building something real.`
  if (streak >= 7) return `${streak} days in. Don\'t stop now.`
  if (streak >= 3) return `${streak} days straight. Keep it going.`
  return `Day ${streak}. Show up.`
}

function equipmentLabel(equipment: string[]): string {
  const labels: Record<string, string> = {
    dumbbell: 'Dumbbells',
    barbell: 'Barbell',
    'band-handle': 'Bands',
    'band-loop': 'Loop bands',
    bench: 'Bench',
    mat: 'Mat',
    'jump-rope': 'Jump rope',
    cable: 'Cable machine',
    machine: 'Machines',
    bodyweight: 'Bodyweight',
    'cardio-machine': 'Cardio machine',
  }
  return equipment.map(e => labels[e] ?? e).join(', ')
}

export default function HomeView({ onStartSession }: Props) {
  const { stats } = useStatsStore()
  const { startSession, phase } = useSessionStore()
  const [todayDay, setTodayDay] = useState<ProgramDay | null>(null)
  const [todaySession, setTodaySession] = useState<WorkoutSession | null>(null)
  const todayComplete = todaySession?.completed ?? false


  useEffect(() => {
    if (stats.programStartDate) {
      const day = getTodaysProgramDay(stats.programStartDate, stats.currentProgramWeek)
      setTodayDay(day ?? null)
    }
    getSessionByDate(todayISO()).then(s => setTodaySession(s ?? null))
  }, [stats])

  function handleStart() {
    if (!todayDay) return
    if (phase === 'idle') startSession(todayDay)
    onStartSession()
  }

  const weekDays = [1, 2, 3, 4, 5, 6, 0]
  const todayDow = new Date().getDay()

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold text-white mt-0.5">Today</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Week</p>
          <p className="text-2xl font-bold text-orange-400">{stats.currentProgramWeek}<span className="text-sm text-gray-500">/8</span></p>
        </div>
      </div>

      {/* Streak */}
      <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{motivationalText(stats.currentStreak, stats.lastWorkoutDate, todayComplete)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-3xl">🔥</span>
          <div className="text-right">
            <p className="text-2xl font-bold text-orange-400 leading-none">{stats.currentStreak}</p>
            <p className="text-xs text-gray-500">day streak</p>
          </div>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(dow => {
          const isToday = dow === todayDow
          const isDone = dow === todayDow && todayComplete
          // days before today in this week
          const dayPassed = (() => {
            const diff = todayDow - dow
            return diff > 0 && diff <= 6
          })()
          const isWalk = dow === 0 || dow === 6
          return (
            <div key={dow} className="flex flex-col items-center gap-1">
              <p className={`text-xs font-medium ${isToday ? 'text-orange-400' : 'text-gray-600'}`}>
                {dayOfWeekLabel(dow)}
              </p>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${isDone ? 'bg-orange-500 text-white' :
                  isWalk ? 'bg-gray-800 text-gray-600' :
                  isToday ? 'bg-gray-800 ring-2 ring-orange-400 text-white' :
                  dayPassed ? 'bg-gray-800 text-gray-600' :
                  'bg-gray-900 text-gray-700'}`}
              >
                {isDone ? '✓' : isWalk ? '🚶' : '·'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's workout card */}
      {todayDay ? (
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className={`px-4 py-2 text-xs font-bold uppercase tracking-widest ${
            todayDay.dayType === 'gym' ? 'bg-blue-900 text-blue-300' :
            todayDay.dayType === 'home' ? 'bg-orange-900 text-orange-300' :
            'bg-green-900 text-green-300'
          }`}>
            {todayDay.dayType === 'gym' ? '🏋️ Gym day' : todayDay.dayType === 'home' ? '🏠 Home workout' : '🚶 Active recovery'}
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-white">{todayDay.name}</h2>
                <p className="text-sm text-gray-400">~{todayDay.estimatedMinutes} min</p>
              </div>
              {todayComplete && (
                <div className="bg-green-800 text-green-300 text-xs font-bold px-3 py-1 rounded-full">
                  Done ✓
                </div>
              )}
            </div>

            {todayDay.dayType !== 'walk' && (
              <>
                <p className="text-xs text-gray-500">
                  {equipmentLabel(todayDay.equipment)}
                </p>
                <div className="space-y-1">
                  {todayDay.exercises.slice(0, 5).map((ex, i) => (
                    <p key={i} className="text-sm text-gray-300">
                      {ex.sets > 0 ? `${ex.sets}×${ex.reps} ` : ''}{ex.exerciseId.replace(/-/g, ' ')}
                    </p>
                  ))}
                  {todayDay.exercises.length > 5 && (
                    <p className="text-xs text-gray-500">+{todayDay.exercises.length - 5} more</p>
                  )}
                </div>
              </>
            )}

            {todayDay.dayType === 'walk' && (
              <p className="text-sm text-gray-400">Log your walk or hike — any distance counts.</p>
            )}

            {!todayComplete && todayDay.dayType !== 'walk' && (
              <button
                onClick={handleStart}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-xl text-lg transition-all mt-2"
              >
                Start Workout
              </button>
            )}

            {todayComplete && todaySession && (
              <div className="text-sm text-gray-400 mt-2">
                Completed in {formatDuration((todaySession.endTime ?? 0) - todaySession.startTime)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl p-6 text-center text-gray-500">
          <p>Rest day — come back tomorrow.</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-900 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">{stats.totalSessions}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total sessions</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">{stats.longestStreak}</p>
          <p className="text-xs text-gray-500 mt-0.5">Best streak</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">W{stats.currentProgramWeek}</p>
          <p className="text-xs text-gray-500 mt-0.5">Current week</p>
        </div>
      </div>
    </div>
  )
}
