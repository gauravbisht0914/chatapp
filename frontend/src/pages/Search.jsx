import { useMemo, useState } from 'react'

const demoUsers = [
    {
        id: 1,
        name: 'Asha Kumar',
        username: 'ashak',
        email: 'asha@example.com',
        role: 'Product Designer',
        location: 'Bangalore, India',
        avatar: 'https://i.pravatar.cc/150?img=32',
    },
    {
        id: 2,
        name: 'Noah Patel',
        username: 'noahp',
        email: 'noah@example.com',
        role: 'Frontend Developer',
        location: 'Mumbai, India',
        avatar: 'https://i.pravatar.cc/150?img=12',
    },
    {
        id: 3,
        name: 'Mia Johnson',
        username: 'miaj',
        email: 'mia@example.com',
        role: 'UX Researcher',
        location: 'Delhi, India',
        avatar: 'https://i.pravatar.cc/150?img=45',
    },
    {
        id: 4,
        name: 'Arjun Singh',
        username: 'arjuns',
        email: 'arjun@example.com',
        role: 'Backend Engineer',
        location: 'Hyderabad, India',
        avatar: 'https://i.pravatar.cc/150?img=18',
    },
]

export default function Search() {
    const [query, setQuery] = useState('')

    const filteredUsers = useMemo(() => {
        const term = query.trim().toLowerCase()
        if (!term) return demoUsers
        return demoUsers.filter((user) => {
            return (
                user.name.toLowerCase().includes(term) ||
                user.username.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.role.toLowerCase().includes(term) ||
                user.location.toLowerCase().includes(term)
            )
        })
    }, [query])

    return (
        <div className='min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-5xl space-y-8'>
                <section className='rounded-[32px] border border-white/10 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl'>
                    <div className='max-w-2xl space-y-4'>
                        <p className='text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300/80'>People search</p>
                        <h1 className='text-4xl font-semibold text-white'>Discover the right profile instantly.</h1>
                        <p className='text-sm leading-6 text-slate-400'>Search by name, username, email, role, or location and browse results with elegant card styling.</p>
                    </div>

                    <div className='mt-8 rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-inner shadow-slate-950/20'>
                        <label className='block text-sm font-medium text-slate-300'>Search users</label>
                        <div className='mt-4'>
                            <input
                                type='search'
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder='Search by name, username, email, role, location'
                                className='w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-5 py-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20'
                            />
                        </div>
                    </div>
                </section>

                <section className='rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30'>
                    <div className='mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <h2 className='text-2xl font-semibold text-white'>Results</h2>
                            <p className='text-sm text-slate-400'>
                                {filteredUsers.length} profile{filteredUsers.length === 1 ? '' : 's'} found
                            </p>
                        </div>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <div className='rounded-[28px] border border-dashed border-slate-700 bg-slate-900/80 px-6 py-10 text-center'>
                            <p className='text-sm font-medium text-slate-200'>No users match your search query.</p>
                            <p className='mt-2 text-sm text-slate-400'>Try a different name, username, or role.</p>
                        </div>
                    ) : (
                        <div className='grid gap-5 md:grid-cols-2'>
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className='overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/10 transition hover:-translate-y-1 hover:border-cyan-500/40'
                                >
                                    <div className='flex items-center gap-4'>
                                        <img src={user.avatar} alt={user.name} className='h-16 w-16 rounded-3xl object-cover ring-2 ring-cyan-400/20' />
                                        <div>
                                            <h3 className='text-lg font-semibold text-white'>{user.name}</h3>
                                            <p className='text-sm text-slate-400'>@{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='mt-5 space-y-3 text-sm text-slate-300'>
                                        <p>
                                            <span className='font-semibold text-white'>Email:</span> {user.email}
                                        </p>
                                        <p>
                                            <span className='font-semibold text-white'>Role:</span> {user.role}
                                        </p>
                                        <p>
                                            <span className='font-semibold text-white'>Location:</span> {user.location}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
