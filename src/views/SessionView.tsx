import { useState } from 'react'
import { useSessionStore } from '../store/sessionStore'
import { useStatsStore } from '../store/statsStore'
import { exerciseMap } from '../data/exercises'
import { getProgramDayMap } from '../data/programs'
import RestTimer from '../components/RestTimer'
import { formatDuration } from '../utils/dates'
import type { ProgramExercise } from '../types'

interface Props {
  onComplete: () => void
}

export default function SessionView({ onComplete }: Props) {
  const {
    session, phase, activeExerciseIndex, activeSetIndex,
    startExercise, logSet, skipSet, skipExercise, endRest, finishSession, abandonSession,
  } = useSessionStore()
  const { recordWorkoutComplete } = useStatsStore()
  const [noteInput, setNoteInput] = useState('')
  const [logReps, setLogReps] = useState<number | ''>('')
  const [logWeight, setLogWeight] = useState<number | ''>('')

  if (phase === 'idle' || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center gap-4">
        <p className="text-gray-400">No active session. Go to Today to start your workout.</p>
      </div>
    )
  }

  const programDay = getProgramDayMap()[session.programDayId]
  const programExercises: ProgramExercise[] = programDay?.exercises ?? []

  // ─── Overview ────────────────────────────────────────────────────────────────
  if (phase === 'overview') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{programDay?.name}</h1>
          <button
            onClick={() => { abandonSession(); onComplete() }}
            className="text-xs text-gray-500 underline"
          >
            Cancel
          </button>
        </div>
        <p className="text-sm text-gray-400">~{programDay?.estimatedMinutes} min · {programExercises.length} exercises</p>

        <div className="space-y-2">
          {programExercises.map((pe, i) => {
            const ex = exerciseMap[pe.exerciseId]
            const sessionEx = session.exercises[i]
            return (
              <div key={pe.exerciseId} className="bg-gray-900 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-white">{ex?.name ?? pe.exerciseId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {pe.sets > 0 ? `${pe.sets} sets × ${pe.reps} reps` : pe.notes ?? ''}
                    {sessionEx?.sets[0]?.weight ? ` · ${sessionEx.sets[0].weight} lbs` : ''}
                  </p>
                </div>
                <p className="text-xs text-gray-600">{ex?.muscleGroups[0]}</p>
              </div>
            )
          })}
        </div>

        <button
          onClick={() => startExercise(0)}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-xl text-lg transition-all"
        >
          Begin
        </button>
      </div>
    )
  }

  // ─── Complete ────────────────────────────────────────────────────────────────
  if (phase === 'complete') {
    const duration = session.endTime
      ? formatDuration(session.endTime - session.startTime)
      : formatDuration(Date.now() - session.startTime)

    const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)

    async function handleFinish() {
      await finishSession(noteInput || undefined)
      await recordWorkoutComplete()
      onComplete()
    }

    return (
      <div className="p-4 space-y-5">
        <div className="text-center py-6 space-y-2">
          <p className="text-5xl">🎉</p>
          <h1 className="text-2xl font-bold text-white">Workout Complete!</h1>
          <p className="text-gray-400">{duration} · {totalSets} sets done</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {session.exercises.filter(ex => !ex.skipped).map(ex => {
            const info = exerciseMap[ex.exerciseId]
            const done = ex.sets.filter(s => s.completed)
            return (
              <div key={ex.exerciseId} className="bg-gray-900 rounded-xl p-3">
                <p className="text-xs font-medium text-white truncate">{info?.name ?? ex.exerciseId}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {done.length} sets · {done[0]?.weight ? `${done[done.length-1]?.weight} lbs` : ''}
                </p>
              </div>
            )
          })}
        </div>

        <div className="bg-gray-900 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-2">Session note (optional)</p>
          <textarea
            className="w-full bg-transparent text-sm text-white placeholder-gray-600 resize-none outline-none"
            rows={2}
            placeholder="How did it feel?"
            value={noteInput}
            onChange={e => setNoteInput(e.target.value)}
          />
        </div>

        <button
          onClick={handleFinish}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-xl text-lg transition-all"
        >
          Save & Finish
        </button>
      </div>
    )
  }

  // ─── Rest ─────────────────────────────────────────────────────────────────────
  if (phase === 'rest') {
    const currentPE = programExercises[activeExerciseIndex]
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-400">
            Exercise {activeExerciseIndex + 1}/{session.exercises.length}
          </p>
        </div>
        <RestTimer seconds={currentPE?.restSeconds ?? 60} onDone={endRest} />
      </div>
    )
  }

  // ─── Exercise ─────────────────────────────────────────────────────────────────
  const currentLoggedEx = session.exercises[activeExerciseIndex]
  const currentSet = currentLoggedEx?.sets[activeSetIndex]
  const exercise = exerciseMap[currentLoggedEx?.exerciseId]
  const progressPct = Math.round((activeExerciseIndex / session.exercises.length) * 100)

  function handleLogSet() {
    const reps = typeof logReps === 'number' ? logReps : currentSet?.targetReps ?? 0
    const weight = typeof logWeight === 'number' ? logWeight : currentSet?.weight ?? 0
    logSet(reps, weight)
    setLogReps('')
    setLogWeight('')
  }

  return (
    <div className="p-4 space-y-4">
      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div
          className="bg-orange-500 h-1.5 rounded-full transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Exercise {activeExerciseIndex + 1}/{session.exercises.length}</span>
        <button onClick={skipExercise} className="underline text-gray-600">Skip exercise</button>
      </div>

      {/* Exercise info */}
      <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            {exercise?.muscleGroups.join(', ')}
          </p>
          <h2 className="text-xl font-bold text-white mt-1">{exercise?.name ?? currentLoggedEx?.exerciseId}</h2>
          {exercise?.notes && (
            <p className="text-sm text-gray-400 mt-2 italic">{exercise.notes}</p>
          )}
        </div>

        {/* Set tracker */}
        <div className="flex gap-2 flex-wrap">
          {currentLoggedEx?.sets.map((s, i) => (
            <div
              key={i}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                ${s.completed ? 'bg-orange-500 text-white' :
                  s.skipped ? 'bg-gray-700 text-gray-500' :
                  i === activeSetIndex ? 'bg-gray-700 ring-2 ring-orange-400 text-white' :
                  'bg-gray-800 text-gray-600'}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Set logging */}
      <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
        <p className="text-sm font-medium text-gray-300">
          Set {activeSetIndex + 1} — Target: {currentSet?.targetReps} reps
          {currentSet?.weight ? ` @ ${currentSet.weight} lbs` : ''}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Reps done</label>
            <input
              type="number"
              inputMode="numeric"
              className="w-full bg-gray-800 text-white text-xl font-bold text-center rounded-xl py-3 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={String(currentSet?.targetReps ?? '')}
              value={logReps}
              onChange={e => setLogReps(e.target.value ? parseInt(e.target.value) : '')}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Weight (lbs)</label>
            <input
              type="number"
              inputMode="decimal"
              className="w-full bg-gray-800 text-white text-xl font-bold text-center rounded-xl py-3 outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={String(currentSet?.weight ?? 0)}
              value={logWeight}
              onChange={e => setLogWeight(e.target.value ? parseFloat(e.target.value) : '')}
            />
          </div>
        </div>

        <button
          onClick={handleLogSet}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-xl text-lg transition-all"
        >
          Log Set {activeSetIndex + 1}
        </button>

        <button
          onClick={() => { skipSet(); setLogReps(''); setLogWeight('') }}
          className="w-full text-sm text-gray-500 underline underline-offset-2"
        >
          Skip this set
        </button>
      </div>

      {/* Upcoming exercises */}
      {activeExerciseIndex < session.exercises.length - 1 && (
        <div className="bg-gray-900 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-2">Up next</p>
          {session.exercises.slice(activeExerciseIndex + 1, activeExerciseIndex + 3).map((ex, i) => {
            const info = exerciseMap[ex.exerciseId]
            const pe = programExercises[activeExerciseIndex + 1 + i]
            return (
              <p key={ex.exerciseId} className="text-sm text-gray-400">
                {info?.name} — {pe?.sets}×{pe?.reps}
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}
