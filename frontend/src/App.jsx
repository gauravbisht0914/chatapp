import './App.css'
import { SideBar } from './components/index.js'
import { Outlet } from 'react-router'
import socketConnection from './utils/socket.js'
import { useEffect } from 'react'


function App() {


  useEffect(() => {
    const disconnectSocket = socketConnection()

    return () => {
      disconnectSocket()
    }
  }, [])

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <div className='relative min-h-screen overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.16),transparent_24%)]' />
        <div className='flex h-screen overflow-hidden'>
          <div className='h-full w-80 flex-shrink-0'>
            <SideBar className='h-full w-full' />
          </div>
          <main className='flex-1 min-h-0 overflow-hidden p-4 md:p-6 lg:p-8'>
            <div className='h-full overflow-y-auto rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/30 backdrop-blur-xl'>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
