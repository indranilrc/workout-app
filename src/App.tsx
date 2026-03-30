import { useState, useEffect } from 'react'
import HomeView from './views/HomeView'
import SessionView from './views/SessionView'
import HistoryView from './views/HistoryView'
import ProgramView from './views/ProgramView'
import BottomNav from './components/BottomNav'
import { useStatsStore } from './store/statsStore'
import { useSessionStore } from './store/sessionStore'

export type Tab = 'home' | 'session' | 'history' | 'program'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const { load, initProgram } = useStatsStore()
  const { loadOverloads, phase } = useSessionStore()

  useEffect(() => {
    load()
    loadOverloads()
    initProgram()
  }, [])

  // If a session is active, lock the user to the session view
  useEffect(() => {
    if (phase === 'exercise' || phase === 'overview' || phase === 'rest') {
      setTab('session')
    }
  }, [phase])

  return (
    <div className="flex flex-col min-h-svh bg-gray-950 text-gray-100 max-w-lg mx-auto">
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
