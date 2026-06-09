import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

const Settings = () => {
  const currentUser = useSelector((state) => state.user);
  console.log("Current user in Settings:", currentUser);

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] border border-white/10 bg-[#0f0f0f] p-8 shadow-2xl shadow-white/10 lg:p-12">
          <div className="mb-10 flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[#111111] p-8 shadow-inner shadow-white/5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                Settings
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Manage your profile & account
              </h1>
              <p className="mt-4 max-w-2xl text-slate-400">
                Update the details below to keep your profile current and
                secure. Change your avatar, name, email, or password with one
                click.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-[28px] border border-white/10 bg-[#0b0b0b] px-5 py-4 shadow-lg shadow-white/5">
              <div className="relative h-16 w-16 overflow-hidden rounded-4xl border border-white/10 bg-[#111111]">
                <img
                  src={currentUser.profileImage?.url}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                  Signed in as
                </p>
                <p className="text-lg font-semibold text-white">
                  {currentUser.username}
                </p>
                <p className="text-sm text-slate-400">{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-2xl shadow-white/10">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Update Profile
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Change your display name, email address, or profile picture.
                  </p>
                </div>
                <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100">
                  Edit avatar
                </button>
              </div>

              <form className="space-y-5">
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Profile picture
                  </span>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={currentUser.profileImage?.url}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-4xl object-cover border border-white/10"
                    />
                    <input
                      type="file"
                      className="block w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-black file:font-semibold"
                    />
                  </div>
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Name
                  </span>
                  <input
                    type="text"
                    defaultValue={currentUser.username}
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Email
                  </span>
                  <input
                    type="email"
                    defaultValue={currentUser.email}
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <button
                  type="button"
                  className="w-full rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                >
                  Save profile changes
                </button>
              </form>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-2xl shadow-white/10">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  Change Password
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Keep your account secure by updating your password regularly.
                </p>
              </div>

              <form className="space-y-5">
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Current password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    New password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-500">
                    Confirm password
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                  />
                </label>

                <button
                  type="button"
                  className="w-full rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
                >
                  Update password
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
