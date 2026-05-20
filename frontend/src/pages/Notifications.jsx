import React from "react";

const notifications = [
  {
    id: 1,
    title: "New message received",
    description: "You have a new message from Alex about the project.",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Friend request accepted",
    description: "Mia accepted your friend request.",
    time: "5 hours ago",
  },
  {
    id: 3,
    title: "System update",
    description: "The app was updated with new security improvements.",
    time: "Yesterday",
  },
];

export default function Notifications() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Notifications
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Stay up to date with your latest alerts and activity.
              </p>
            </div>
            <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-4 py-2 text-sm font-medium text-blue-300">
              {notifications.length} alerts
            </span>
          </div>
        </div>

        <section className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className="group rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700/50 p-5 backdrop-blur-sm transition-all duration-300 hover:from-slate-800/80 hover:to-slate-700/80 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {notification.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400 group-hover:text-slate-300 transition-colors">
                    {notification.description}
                  </p>
                </div>
                <time className="whitespace-nowrap text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                  {notification.time}
                </time>
              </div>
            </article>
          ))}

          <div className="rounded-xl border border-dashed border-slate-700/50 bg-slate-800/30 p-6 text-center">
            <p className="text-sm text-slate-400">Check back later for new notifications.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
