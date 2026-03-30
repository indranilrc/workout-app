import { useState } from 'react'
import type { UserProfile } from '../store/userStore'

interface Props {
  user: UserProfile
  onSuccess: () => void
  onBack: () => void
}

const COLOR: Record<string, { bg: string; ring: string; dot: string }> = {
  orange: { bg: 'bg-orange-500', ring: 'ring-orange-400', dot: 'bg-orange-400' },
  purple: { bg: 'bg-purple-500', ring: 'ring-purple-400', dot: 'bg-purple-400' },
}

function pinKey(userId: string) {
  return `workout-pin-${userId}`
}

export function hasPin(userId: string): boolean {
  return !!localStorage.getItem(pinKey(userId))
}

function savePin(userId: string, pin: string) {
  localStorage.setItem(pinKey(userId), pin)
}

function checkPin(userId: string, pin: string): boolean {
  return localStorage.getItem(pinKey(userId)) === pin
}

export default function PinView({ user, onSuccess, onBack }: Props) {
  const isSettingUp = !hasPin(user.id)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [stage, setStage] = useState<'enter' | 'confirm'>('enter')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const style = COLOR[user.color]

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  function handleDigit(d: string) {
    setError('')
    if (stage === 'enter') {
      if (pin.length >= 4) return
      const next = pin + d
      setPin(next)
      if (next.length === 4) {
        if (isSettingUp) {
          // First time — move to confirm stage
          setTimeout(() => setStage('confirm'), 150)
        } else {
          // Check PIN
          setTimeout(() => {
            if (checkPin(user.id, next)) {
              onSuccess()
            } else {
              setError('Wrong PIN. Try again.')
              triggerShake()
              setPin('')
            }
          }, 150)
        }
      }
    } else {
      // Confirm stage (setup)
      if (confirmPin.length >= 4) return
      const next = confirmPin + d
      setConfirmPin(next)
      if (next.length === 4) {
        setTimeout(() => {
          if (next === pin) {
            savePin(user.id, pin)
            onSuccess()
          } else {
            setError('PINs don\'t match. Start over.')
            triggerShake()
            setPin('')
            setConfirmPin('')
            setStage('enter')
          }
        }, 150)
      }
    }
  }

  function handleDelete() {
    setError('')
    if (stage === 'enter') setPin(p => p.slice(0, -1))
    else setConfirmPin(p => p.slice(0, -1))
  }

  const currentPin = stage === 'enter' ? pin : confirmPin
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']

  return (
    <div className="min-h-svh bg-gray-950 flex flex-col items-center justify-center p-8 gap-8">
      {/* User avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className={`w-16 h-16 rounded-full ${style.bg} flex items-center justify-center`}>
          <span className="text-2xl font-bold text-white">{user.name}</span>
        </div>
        <p className="text-white font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">
          {isSettingUp
            ? stage === 'enter' ? 'Create a 4-digit PIN' : 'Confirm your PIN'
            : 'Enter your PIN'}
        </p>
      </div>

      {/* PIN dots */}
      <div className={`flex gap-4 ${shake ? 'animate-bounce' : ''}`}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              i < currentPin.length
                ? `${style.dot} border-transparent`
                : 'border-gray-600 bg-transparent'
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 w-64">
        {digits.map((d, i) => {
          if (d === null) return <div key={i} />
          if (d === 'del') {
            return (
              <button
                key={i}
                onClick={handleDelete}
                className="h-16 rounded-2xl bg-gray-800 text-gray-300 text-xl flex items-center justify-center active:scale-95 transition-transform"
              >
                ⌫
              </button>
            )
          }
          return (
            <button
              key={i}
              onClick={() => handleDigit(String(d))}
              className="h-16 rounded-2xl bg-gray-800 text-white text-xl font-semibold flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-700"
            >
              {d}
            </button>
          )
        })}
      </div>

      <button onClick={onBack} className="text-xs text-gray-600 underline underline-offset-2">
        Back
      </button>
    </div>
  )
}
