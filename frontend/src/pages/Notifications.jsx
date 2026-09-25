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
    <main className="page-enter min-h-full bg-white px-4 py-8 text-slate-900 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Notifications
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Stay up to date with your latest alerts and activity.
              </p>
            </div>
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
              {notifications.length} alerts
            </span>
          </div>
        </div>

        <section className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {notification.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {notification.description}
                  </p>
                </div>
                <time className="whitespace-nowrap rounded-lg bg-slate-50 px-3 py-1 text-xs text-slate-500">
                  {notification.time}
                </time>
              </div>
            </article>
          ))}

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-500">
              Check back later for new notifications.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
