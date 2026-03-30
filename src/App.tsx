import { useState, useEffect } from 'react'
import HomeView from './views/HomeView'
import SessionView from './views/SessionView'
import HistoryView from './views/HistoryView'
import ProgramView from './views/ProgramView'
import UserSelectView from './views/UserSelectView'
import BottomNav from './components/BottomNav'
import { useStatsStore } from './store/statsStore'
import { useSessionStore } from './store/sessionStore'
import { useUserStore } from './store/userStore'

export type Tab = 'home' | 'session' | 'history' | 'program'

const USER_COLOR: Record<string, string> = {
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const { load, initProgram } = useStatsStore()
  const { loadOverloads, phase } = useSessionStore()
  const { currentUser, clearUser } = useUserStore()

  useEffect(() => {
    if (currentUser) {
      load()
      loadOverloads()
      initProgram()
    }
  }, [currentUser])

  useEffect(() => {
    if (phase === 'exercise' || phase === 'overview' || phase === 'rest') {
      setTab('session')
    }
  }, [phase])

  if (!currentUser) {
    return <UserSelectView />
  }

  return (
    <div className="flex flex-col min-h-svh bg-gray-950 text-gray-100 max-w-lg mx-auto">
      {/* User indicator + switch */}
      <div className="flex justify-end items-center px-4 pt-3 pb-1 gap-2">
        <div className={`w-6 h-6 rounded-full ${USER_COLOR[currentUser.color]} flex items-center justify-center`}>
          <span className="text-xs font-bold text-white">{currentUser.name[0]}</span>
        </div>
        <span className="text-xs text-gray-500">{currentUser.name}</span>
        <button
          onClick={clearUser}
          className="text-xs text-gray-600 underline underline-offset-2 ml-1"
        >
          Switch
        </button>
      </div>

      <main className="flex-1 overflow-y-auto pb-20">
        {tab === 'home' && <HomeView onStartSession={() => setTab('session')} />}
        {tab === 'session' && <SessionView onComplete={() => setTab('home')} />}
        {tab === 'history' && <HistoryView />}
        {tab === 'program' && <ProgramView />}
      </main>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
