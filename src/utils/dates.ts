export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDuration(ms: number): string {
  const totalSecs = Math.floor(ms / 1000)
  const m = Math.floor(totalSecs / 60)
  const s = totalSecs % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

/**
 * Returns true if date b is the day after date a (ISO strings).
 */
export function isConsecutiveDay(a: string, b: string): boolean {
  const dateA = new Date(a + 'T00:00:00')
  const dateB = new Date(b + 'T00:00:00')
  const diff = dateB.getTime() - dateA.getTime()
  return diff === 86400000 // exactly 1 day in ms
}

export function dayOfWeekLabel(dow: number): string {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow]
}

export function isoToDate(iso: string): Date {
  return new Date(iso + 'T00:00:00')
}
