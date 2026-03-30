import { useState } from 'react'
import { program } from '../data/program'
import { exerciseMap } from '../data/exercises'
import { useStatsStore } from '../store/statsStore'
import { dayOfWeekLabel } from '../utils/dates'

const DAY_TYPE_ICON: Record<string, string> = {
  home: '🏠',
  gym: '🏋️',
  walk: '🚶',
}

export default function ProgramView() {
  const { stats } = useStatsStore()
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const currentWeek = stats.currentProgramWeek

  const weeks = Array.from({ length: 8 }, (_, i) => i + 1)
  const todayDow = new Date().getDay()

  function isDeload(week: number) {
    return week === 4 || week === 8
  }

  return (
    <div className="p-4 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">8-Week Program</h1>
        <p className="text-sm text-gray-500 mt-1">Hybrid home + gym · Mon–Fri</p>
      </div>

      {weeks.map(week => {
        const weekDays = program.filter(d => d.week === week)
        const isCurrent = week === currentWeek
        const isPast = week < currentWeek

        return (
          <div key={week} className={`rounded-2xl overflow-hidden border ${
            isCurrent ? 'border-orange-500' : 'border-gray-800'
          }`}>
            <div className={`px-4 py-3 flex justify-between items-center ${
              isCurrent ? 'bg-orange-950' : 'bg-gray-900'
            }`}>
              <div className="flex items-center gap-2">
                <p className={`font-bold ${isCurrent ? 'text-orange-400' : isPast ? 'text-gray-500' : 'text-white'}`}>
                  Week {week}
                </p>
                {isCurrent && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">Current</span>}
                {isDeload(week) && <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">Deload</span>}
              </div>
              <p className="text-xs text-gray-500">
                {week <= 4 ? 'Phase 1' : 'Phase 2'}
              </p>
            </div>

            <div className="divide-y divide-gray-800">
              {weekDays
                .filter(d => d.dayOfWeek >= 1 && d.dayOfWeek <= 5) // Mon–Fri only in list
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map(day => {
                  const isToday = isCurrent && day.dayOfWeek === todayDow
                  const isExpanded = expandedDay === day.id

                  return (
                    <div key={day.id}>
                      <button
                        className={`w-full px-4 py-3 flex justify-between items-center text-left ${
                          isToday ? 'bg-orange-950/30' : 'bg-gray-900'
                        }`}
                        onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{DAY_TYPE_ICON[day.dayType]}</span>
                          <div>
                            <p className={`text-sm font-medium ${isToday ? 'text-orange-300' : 'text-white'}`}>
                              {dayOfWeekLabel(day.dayOfWeek)} — {day.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {day.dayType === 'walk' ? 'Active recovery' : `~${day.estimatedMinutes} min · ${day.exercises.length} exercises`}
                            </p>
                          </div>
                        </div>
                        <span className="text-gray-600 text-xs">{isExpanded ? '▲' : '▼'}</span>
                      </button>

                      {isExpanded && day.dayType !== 'walk' && (
                        <div className="bg-gray-950 px-4 py-3 space-y-2">
                          {day.exercises.map((pe, i) => {
                            const exInfo = exerciseMap[pe.exerciseId]
                            return (
                              <div key={i} className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-gray-200">{exInfo?.name ?? pe.exerciseId}</p>
                                  <p className="text-xs text-gray-600">
                                    {exInfo?.muscleGroups.join(', ')}
                                  </p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                  {pe.sets > 0 ? (
                                    <p className="text-xs text-gray-400">{pe.sets}×{pe.reps}</p>
                                  ) : (
                                    <p className="text-xs text-gray-500">{pe.notes}</p>
                                  )}
                                  {pe.startingWeight > 0 && (
                                    <p className="text-xs text-gray-600">{pe.startingWeight} lbs</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              {/* Weekend summary */}
              <div className="px-4 py-2 bg-gray-900 flex items-center gap-2 text-xs text-gray-600">
                <span>🚶</span>
                <span>Sat & Sun — Walk / Hike (active recovery)</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
