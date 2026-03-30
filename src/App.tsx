import { useState, useEffect } from 'react'
import HomeView from './views/HomeView'
import SessionView from './views/SessionView'
import HistoryView from './views/HistoryView'
import ProgramView from './views/ProgramView'
import SettingsView from './views/SettingsView'
import UserSelectView from './views/UserSelectView'
import BottomNav from './components/BottomNav'
import { useStatsStore } from './store/statsStore'
import { useSessionStore } from './store/sessionStore'
import { useUserStore } from './store/userStore'

export type Tab = 'home' | 'session' | 'history' | 'program' | 'settings'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const { load, initProgram } = useStatsStore()
  const { loadOverloads, phase } = useSessionStore()
  const { currentUser } = useUserStore()

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
      <main className="flex-1 overflow-y-auto pb-20">
        {tab === 'home'     && <HomeView onStartSession={() => setTab('session')} />}
        {tab === 'session'  && <SessionView onComplete={() => setTab('home')} />}
        {tab === 'history'  && <HistoryView />}
        {tab === 'program'  && <ProgramView />}
        {tab === 'settings' && <SettingsView />}
      </main>
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  )
}
