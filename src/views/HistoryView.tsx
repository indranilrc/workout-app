import { useEffect, useState } from 'react'
import { getAllSessions, getProgressForExercise } from '../db'
import { exerciseMap } from '../data/exercises'
import { formatDate, formatDuration } from '../utils/dates'
import type { WorkoutSession, ExerciseProgress } from '../types'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

export default function HistoryView() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [progress, setProgress] = useState<ExerciseProgress[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    getAllSessions().then(setSessions)
  }, [])

  useEffect(() => {
    if (selectedExercise) {
      getProgressForExercise(selectedExercise).then(setProgress)
    } else {
      setProgress([])
    }
  }, [selectedExercise])

  // Exercises that have been logged at least once
  const loggedExerciseIds = [...new Set(
    sessions.flatMap(s => s.exercises.map(e => e.exerciseId))
  )]

  return (
    <div className="p-4 space-y-5">
      <h1 className="text-2xl font-bold">History</h1>

      {/* Progress chart */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-medium text-gray-300">Exercise progress</p>
        <select
          className="w-full bg-gray-800 text-white text-sm rounded-xl px-3 py-2 outline-none"
          value={selectedExercise}
          onChange={e => setSelectedExercise(e.target.value)}
        >
          <option value="">Select an exercise…</option>
          {loggedExerciseIds.map(id => (
            <option key={id} value={id}>{exerciseMap[id]?.name ?? id}</option>
          ))}
        </select>

        {progress.length > 1 ? (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={progress.map(p => ({ date: p.date.slice(5), weight: p.weight, reps: p.reps }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : selectedExercise ? (
          <p className="text-xs text-gray-600 text-center py-4">Not enough data yet — keep logging!</p>
        ) : null}
      </div>

      {/* Session list */}
      {sessions.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-4xl mb-3">📋</p>
          <p>No sessions yet. Complete your first workout!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const duration = session.endTime
              ? formatDuration(session.endTime - session.startTime)
              : null
            const completedSets = session.exercises.reduce(
              (acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0
            )
            const isExpanded = expandedId === session.id

            return (
              <div key={session.id} className="bg-gray-900 rounded-2xl overflow-hidden">
                <button
                  className="w-full p-4 text-left flex justify-between items-start"
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                >
                  <div>
                    <p className="text-sm font-bold text-white">{formatDate(session.date)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {session.programDayId.replace(/w\d+d\d+/, '')} · {completedSets} sets
                      {duration ? ` · ${duration}` : ''}
                    </p>
                  </div>
                  <span className="text-gray-600 text-sm">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 border-t border-gray-800 pt-3">
                    {session.exercises.filter(ex => !ex.skipped).map(ex => {
                      const info = exerciseMap[ex.exerciseId]
                      const done = ex.sets.filter(s => s.completed)
                      return (
                        <div key={ex.exerciseId}>
                          <p className="text-xs font-medium text-gray-300">{info?.name ?? ex.exerciseId}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {done.map((s, i) => (
                              <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                                {s.completedReps}r @ {s.weight}lb
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                    {session.notes && (
                      <p className="text-xs text-gray-500 italic mt-2">"{session.notes}"</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
