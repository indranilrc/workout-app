import { program, programDayMap } from './program'
import { programSJ, programDayMapSJ } from './program-sj'
import type { ProgramDay } from '../types'

function currentUserId(): string {
  return localStorage.getItem('workout-current-user') ?? 'irc'
}

export function getProgram(): ProgramDay[] {
  return currentUserId() === 'sj' ? programSJ : program
}

export function getProgramDayMap(): Record<string, ProgramDay> {
  return currentUserId() === 'sj' ? programDayMapSJ : programDayMap
}

export function getTodaysProgramDay(currentProgramWeek: number): ProgramDay | undefined {
  const dow = new Date().getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6
  const map = getProgramDayMap()
  const userId = currentUserId()
  const prefix = userId === 'sj' ? `sj-w${currentProgramWeek}d${dow}` : `w${currentProgramWeek}d${dow}`
  return map[prefix]
}
