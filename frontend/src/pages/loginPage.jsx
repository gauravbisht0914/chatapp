import { useState } from 'react'
import Auth from '../backend/Auth'

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [message, setMessage] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try{
        if (isLogin) {
            const res = await Auth.login({ email: formData.email, password: formData.password })
            console.log('Login successful:', res)
        }

        const res = await Auth.signup({ email: formData.email, password: formData.password, username: formData.username })
        console.log('Signup successful:', res)

        } catch (error) {
            console.error('Login error:', error)
        
        }

        
    }

    return (
        <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center px-4 py-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_18%)]" />
            <div className="relative z-10 w-full max-w-[90%] overflow-hidden rounded-[32px] border border-white/10 bg-[#101010] shadow-2xl shadow-slate-950/40">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] p-8 lg:p-10">
                    <div className="rounded-[28px] border border-white/10 bg-[#0f0f0f] p-7 text-white shadow-lg shadow-white/5">
                        <div className="mb-6">
                            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Welcome back</p>
                            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">{isLogin ? 'Sign in to your chat hub' : 'Create a new account'}</h1>
                            <p className="mt-3 max-w-md text-sm text-slate-400">Secure access with a crisp monochrome layout designed for easy messaging.</p>
                        </div>

                        <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0a0a0a] p-5">
                            <button
                                type="button"
                                onClick={() => setIsLogin(true)}
                                className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${isLogin ? 'bg-white text-black shadow-sm shadow-white/20' : 'bg-[#121212] text-slate-300 hover:bg-white/5'}`}>
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsLogin(false)}
                                className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${!isLogin ? 'bg-white text-black shadow-sm shadow-white/20' : 'bg-[#121212] text-slate-300 hover:bg-white/5'}`}>
                                Sign up
                            </button>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-[#0f0f0f] p-8 shadow-lg shadow-white/5">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{isLogin ? 'Login' : 'Create account'}</p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">{isLogin ? 'Access your account' : 'Start your journey'}</h2>
                            </div>
                            <div className="hidden items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300 sm:flex">
                                {isLogin ? 'login' : 'signup'} mode
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <label className="block">
                                    <span className="mb-2 inline-block text-sm font-medium text-slate-300">Username</span>
                                    <input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Choose a nickname"
                                        className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                                    />
                                </label>
                            )}

                            <label className="block">
                                <span className="mb-2 inline-block text-sm font-medium text-slate-300">Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 inline-block text-sm font-medium text-slate-300">Password</span>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                                />
                            </label>

                            <button
                                type="submit"
                                className="w-full rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                            >
                                {isLogin ? 'Log in' : 'Create account'}
                            </button>
                        </form>

                        <p className="mt-5 text-sm text-slate-400">
                            {isLogin ? 'New here?' : 'Already have an account?'}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-semibold text-white/80 transition hover:text-white"
                            >
                                {isLogin ? 'Create one' : 'Sign in'}
                            </button>
                        </p>

                        {message && <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white">{message}</div>}

                        <div className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-4 text-sm text-slate-400">
                            <p className="font-medium text-white">Secure cloud chat</p>
                            <p className="mt-2 leading-6">Your credentials remain private and the interface is built to feel seamless with the rest of the site.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
