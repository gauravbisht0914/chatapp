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
    <main className="min-h-screen bg-[#090909] text-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Notifications
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Stay up to date with your latest alerts and activity.
              </p>
            </div>
            <span className="rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm font-medium text-slate-200">
              {notifications.length} alerts
            </span>
          </div>
        </div>

        <section className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className="group rounded-xl bg-[#0f0f0f] border border-white/10 p-5 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-white">
                    {notification.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {notification.description}
                  </p>
                </div>
                <time className="whitespace-nowrap text-xs text-slate-200 bg-white/5 px-3 py-1 rounded-lg">
                  {notification.time}
                </time>
              </div>
            </article>
          ))}

          <div className="rounded-xl border border-dashed border-white/10 bg-[#0b0b0b] p-6 text-center">
            <p className="text-sm text-slate-400">
              Check back later for new notifications.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
