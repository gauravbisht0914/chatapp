import { useState, useEffect } from "react";
import Auth from "../backend/Auth.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkUserAuth } from "@/store/userSlice.js";
import { fetchRecentMessageRooms } from "@/store/messageRoomSlice.js";
import { Toast } from "@/components/index.js";

function LoginPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user._id) {
      navigate("/chat");
    }
  }, [user]);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isLogin) {
        await Auth.login({
          email: formData.email,
          password: formData.password,
        });
        return;
      }

      await Auth.signup({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Login failed. Please try again.");
    } finally {
      dispatch(checkUserAuth());
      dispatch(fetchRecentMessageRooms());
      navigate("/chat");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return user._id ? (
    ""
  ) : (
    <div className="page-enter flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-8 text-slate-900 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.10),transparent_28%)]" />
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_80px_-45px_rgba(30,41,59,0.45)]">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] p-8 lg:p-10">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-7 text-slate-900 shadow-sm sm:p-9">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Welcome back
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                {isLogin ? "Sign in to your chat hub" : "Create a new account"}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                Secure access with a crisp monochrome layout designed for easy
                messaging.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-indigo-100 bg-white p-2">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${isLogin ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${!isLogin ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-9">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  {isLogin ? "Login" : "Create account"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {isLogin ? "Access your account" : "Start your journey"}
                </h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-300 sm:flex">
                {isLogin ? "login" : "signup"} mode
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <label className="block">
                  <span className="mb-2 inline-block text-sm font-medium text-slate-300">
                    Username
                  </span>
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
                <span className="mb-2 inline-block text-sm font-medium text-slate-300">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="mb-2 inline-block text-sm font-medium text-slate-300">
                  Password
                </span>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                />
              </label>

              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="cursor-pointer text-sm font-medium text-slate-300 transition hover:text-white"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {isLogin ? "Log in" : "Create account"}
              </button>
            </form>

            <p className="mt-5 text-sm text-slate-400">
              {isLogin ? "New here?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-semibold text-white/80 transition hover:text-white"
              >
                {isLogin ? "Create one" : "Sign in"}
              </button>
            </p>

            {message && (
              <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end">
                <Toast
                  type="error"
                  message={message}
                  onClose={() => setMessage("")}
                />
              </div>
            )}

            <div className="mt-8 rounded-3xl border border-white/10 bg-[#111111] p-4 text-sm text-slate-400">
              <p className="font-medium text-white">Secure cloud chat</p>
              <p className="mt-2 leading-6">
                Your credentials remain private and the interface is built to
                feel seamless with the rest of the site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
