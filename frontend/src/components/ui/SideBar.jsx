import { NavLink } from "react-router"

function SideBar({ className }) {
    const navStyle = ({ isActive }) =>
        `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${isActive
            ? 'bg-cyan-500/15 text-cyan-300 shadow-lg shadow-cyan-500/10'
            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
        }`

    const friends = [
        { id: 1, name: 'Alice Johnson', img: 'https://i.pravatar.cc/40?img=1', status: 'online' },
    ]

    return (
        <aside className={`${className || 'w-full'} flex flex-col gap-6 p-5 lg:p-6`}>
            <div className='frosted-panel min-h-[24rem] flex flex-col justify-between rounded-[32px] border border-slate-700/70 p-5 shadow-2xl shadow-slate-950/30'>
                <div>
                    <div className='mb-8'>
                        <p className='text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80'>Welcome back</p>
                        <h1 className='mt-4 text-3xl font-semibold text-white'>Aurora Chat</h1>
                        <p className='mt-2 max-w-sm text-sm text-slate-400'>A polished messaging experience with dreamy glass layers and vivid accents.</p>
                    </div>

                    <nav className='space-y-3'>
                        <NavLink to='/chat/s' className={navStyle}>
                            <ion-icon name='chatbubble-outline' class='text-xl' />
                            <span>Chat</span>
                        </NavLink>
                        <NavLink to='/search' className={navStyle}>
                            <ion-icon name='search-outline' class='text-xl' />
                            <span>Search</span>
                        </NavLink>
                        <NavLink to='/settings' className={navStyle}>
                            <ion-icon name='settings-outline' class='text-xl' />
                            <span>Settings</span>
                        </NavLink>
                        <NavLink to='/notifications' className={navStyle}>
                            <ion-icon name='notifications-outline' class='text-xl' />
                            <span>Notifications</span>
                        </NavLink>
                    </nav>
                </div>

                <div className='rounded-[28px] border border-cyan-400/10 bg-white/5 p-4 mt-5'>
                    <div className='flex items-center gap-3'>
                        <div className='h-12 w-12 rounded-3xl bg-cyan-500/15 flex items-center justify-center text-cyan-300'>
                            <ion-icon name='person-circle-outline' class='text-2xl' />
                        </div>
                        <div>
                            <p className='text-sm text-slate-400'>Good afternoon</p>
                            <p className='font-semibold text-white'>Alex Morgan</p>
                        </div>
                    </div>
                    <button className='mt-4 w-full rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400'>Logout</button>
                </div>
            </div>

            <div className='frosted-panel rounded-[32px] border border-slate-700/70 p-5 shadow-2xl shadow-slate-950/20'>
                <h2 className='text-base font-semibold text-white'>Active friends</h2>
                <div className='mt-4 space-y-3'>
                    {friends.map((friend) => (
                        <div key={friend.id} className='flex items-center gap-3 rounded-3xl border border-slate-700/50 bg-slate-950/80 p-3'>
                            <img src={friend.img} alt={friend.name} className='h-12 w-12 rounded-3xl object-cover' />
                            <div className='flex-1'>
                                <p className='font-medium text-white'>{friend.name}</p>
                                <p className='text-xs text-slate-400'>
                                    <span className={friend.status === 'online' ? 'text-emerald-400' : 'text-slate-500'}>●</span>
                                    <span className='ml-2 capitalize text-slate-400'>{friend.status}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default SideBar