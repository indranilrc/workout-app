import { USERS, useUserStore } from '../store/userStore'

const COLOR_STYLES: Record<string, { bg: string; ring: string; text: string }> = {
  orange: { bg: 'bg-orange-500', ring: 'ring-orange-400', text: 'text-orange-400' },
  purple: { bg: 'bg-purple-500', ring: 'ring-purple-400', text: 'text-purple-400' },
}

export default function UserSelectView() {
  const { selectUser } = useUserStore()

  return (
    <div className="min-h-svh bg-gray-950 flex flex-col items-center justify-center p-8 gap-10">
      <div className="text-center space-y-2">
        <p className="text-4xl">💪</p>
        <h1 className="text-2xl font-bold text-white">Who's working out?</h1>
      </div>

      <div className="flex gap-6 w-full max-w-xs">
        {USERS.map(user => {
          const style = COLOR_STYLES[user.color]
          return (
            <button
              key={user.id}
              onClick={() => selectUser(user.id)}
              className={`flex-1 flex flex-col items-center gap-4 bg-gray-900 rounded-2xl py-8 px-4
                active:scale-95 transition-all ring-2 ring-transparent hover:ring-2 hover:${style.ring}`}
            >
              <div className={`w-16 h-16 rounded-full ${style.bg} flex items-center justify-center`}>
                <span className="text-2xl font-bold text-white">{user.name}</span>
              </div>
              <p className={`text-sm font-semibold ${style.text}`}>{user.name}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
