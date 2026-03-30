import type { Tab } from '../App'

interface Props {
  tab: Tab
  onChange: (t: Tab) => void
}

const items: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',    label: 'Today',   icon: '🏠' },
  { id: 'session', label: 'Workout', icon: '💪' },
  { id: 'history', label: 'History', icon: '📈' },
  { id: 'program', label: 'Program', icon: '📋' },
]

export default function BottomNav({ tab, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-gray-900 border-t border-gray-800 flex">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors ${
            tab === item.id ? 'text-orange-400' : 'text-gray-500'
          }`}
        >
          <span className="text-xl leading-none">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
