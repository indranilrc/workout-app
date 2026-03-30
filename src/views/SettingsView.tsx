import { useState } from 'react'
import { useUserStore } from '../store/userStore'

const PIN_DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'] as const

function pinKey(userId: string) {
  return `workout-pin-${userId}`
}

function checkPin(userId: string, pin: string): boolean {
  return localStorage.getItem(pinKey(userId)) === pin
}

function savePin(userId: string, pin: string) {
  localStorage.setItem(pinKey(userId), pin)
}

type Stage = 'menu' | 'current' | 'new' | 'confirm'

interface PinPadProps {
  label: string
  error: string
  value: string
  onDigit: (d: string) => void
  onDelete: () => void
}

function PinPad({ label, error, value, onDigit, onDelete }: PinPadProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-gray-400">{label}</p>

      <div className="flex gap-4">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all ${
              i < value.length ? 'bg-orange-400 border-transparent' : 'border-gray-600'
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-3 gap-3 w-56">
        {PIN_DIGITS.map((d, i) => {
          if (d === null) return <div key={i} />
          if (d === 'del') {
            return (
              <button key={i} onClick={onDelete}
                className="h-14 rounded-2xl bg-gray-800 text-gray-300 text-xl flex items-center justify-center active:scale-95 transition-transform">
                ⌫
              </button>
            )
          }
          return (
            <button key={i} onClick={() => onDigit(String(d))}
              className="h-14 rounded-2xl bg-gray-800 text-white text-lg font-semibold flex items-center justify-center active:scale-95 transition-transform hover:bg-gray-700">
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function SettingsView() {
  const { currentUser, clearUser } = useUserStore()
  const [stage, setStage] = useState<Stage>('menu')
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!currentUser) return null
  const userId = currentUser.id

  function reset() {
    setStage('menu')
    setCurrentPin('')
    setNewPin('')
    setConfirmPin('')
    setError('')
  }

  function handleCurrentDigit(d: string) {
    if (currentPin.length >= 4) return
    setError('')
    const next = currentPin + d
    setCurrentPin(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (checkPin(userId, next)) {
          setStage('new')
          setCurrentPin('')
        } else {
          setError('Wrong PIN.')
          setCurrentPin('')
        }
      }, 150)
    }
  }

  function handleNewDigit(d: string) {
    if (newPin.length >= 4) return
    setError('')
    const next = newPin + d
    setNewPin(next)
    if (next.length === 4) setTimeout(() => setStage('confirm'), 150)
  }

  function handleConfirmDigit(d: string) {
    if (confirmPin.length >= 4) return
    setError('')
    const next = confirmPin + d
    setConfirmPin(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === newPin) {
          savePin(userId, newPin)
          setSuccess('PIN updated successfully.')
          reset()
        } else {
          setError("PINs don't match. Try again.")
          setNewPin('')
          setConfirmPin('')
          setStage('new')
        }
      }, 150)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {success && (
        <div className="bg-green-900/40 border border-green-700 text-green-300 text-sm rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      {/* Change PIN */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <button
          className="w-full px-4 py-4 flex justify-between items-center text-left"
          onClick={() => { setSuccess(''); stage === 'menu' ? setStage('current') : reset() }}
        >
          <div>
            <p className="text-sm font-medium text-white">Change PIN</p>
            <p className="text-xs text-gray-500 mt-0.5">Update your 4-digit PIN</p>
          </div>
          <span className="text-gray-600">{stage !== 'menu' ? '▲' : '▶'}</span>
        </button>

        {stage === 'current' && (
          <div className="border-t border-gray-800 px-4 py-6 flex justify-center">
            <PinPad
              label="Enter your current PIN"
              error={error}
              value={currentPin}
              onDigit={handleCurrentDigit}
              onDelete={() => { setError(''); setCurrentPin(p => p.slice(0, -1)) }}
            />
          </div>
        )}

        {stage === 'new' && (
          <div className="border-t border-gray-800 px-4 py-6 flex justify-center">
            <PinPad
              label="Enter your new PIN"
              error={error}
              value={newPin}
              onDigit={handleNewDigit}
              onDelete={() => { setError(''); setNewPin(p => p.slice(0, -1)) }}
            />
          </div>
        )}

        {stage === 'confirm' && (
          <div className="border-t border-gray-800 px-4 py-6 flex justify-center">
            <PinPad
              label="Confirm your new PIN"
              error={error}
              value={confirmPin}
              onDigit={handleConfirmDigit}
              onDelete={() => { setError(''); setConfirmPin(p => p.slice(0, -1)) }}
            />
          </div>
        )}
      </div>

      {/* Switch user */}
      <div className="bg-gray-900 rounded-2xl">
        <button
          className="w-full px-4 py-4 flex justify-between items-center text-left"
          onClick={clearUser}
        >
          <div>
            <p className="text-sm font-medium text-white">Switch User</p>
            <p className="text-xs text-gray-500 mt-0.5">Go back to user selection</p>
          </div>
          <span className="text-gray-600">▶</span>
        </button>
      </div>
    </div>
  )
}
