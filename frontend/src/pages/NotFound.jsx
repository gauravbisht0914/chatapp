import React from "react";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-[0_28px_80px_-45px_rgba(30,41,59,0.45)]">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            404 error
          </p>
          <h1 className="mt-4 text-5xl font-semibold text-slate-900">
            Page not found
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            The page you are looking for doesn’t exist or has been moved.
          </p>
        </div>
        <div className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white">
          Return home
        </div>
      </div>
    </div>
  );
}

export default NotFound;
