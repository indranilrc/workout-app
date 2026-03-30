import { useEffect, useState } from 'react'

interface Props {
  seconds: number
  onDone: () => void
}

export default function RestTimer({ seconds, onDone }: Props) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) {
      onDone()
      return
    }
    const id = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining, onDone])

  const pct = ((seconds - remaining) / seconds) * 100

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">Rest</p>

      {/* Circular progress */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#1f2937" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="#f97316"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{remaining}</span>
        </div>
      </div>

      <button
        onClick={onDone}
        className="text-sm text-gray-400 underline underline-offset-2"
      >
        Skip rest
      </button>
    </div>
  )
}
