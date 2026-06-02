import React from 'react'

function NotFound() {
    return (
        <div className='min-h-screen bg-[#090909] px-4 py-8 text-slate-100'>
            <div className='mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 rounded-[32px] border border-white/10 bg-[#111111] p-10 shadow-2xl shadow-white/10'>
                <div className='text-center'>
                    <p className='text-sm uppercase tracking-[0.35em] text-slate-400'>404 error</p>
                    <h1 className='mt-4 text-5xl font-semibold text-white'>Page not found</h1>
                    <p className='mt-3 text-sm text-slate-400'>The page you are looking for doesn’t exist or has been moved.</p>
                </div>
                <div className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-black'>Return home</div>
            </div>
        </div>
    )
}

export default NotFound