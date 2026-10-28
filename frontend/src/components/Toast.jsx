import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Toast({ type = "success", title, message, onClose }) {
  const isError = type === "error";
  const isMessage = type === "message";
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onCloseRef.current?.();
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [message, title]);

  return createPortal(
    <div className="pointer-events-none fixed inset-x-3 top-3 z-[10000] flex justify-center sm:inset-x-auto sm:right-6 sm:top-6 sm:w-96 sm:justify-end">
      <div
        className={`page-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${
          isError
            ? "border-red-200 bg-red-50 text-red-800"
            : isMessage
              ? "border-indigo-200 bg-white text-slate-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }`}
        role={isError ? "alert" : "status"}
        aria-live="polite"
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            isError
              ? "bg-red-100"
              : isMessage
                ? "bg-indigo-100 text-indigo-700"
                : "bg-emerald-100"
          }`}
          aria-hidden="true"
        >
          {isError ? "!" : isMessage ? "•" : "✓"}
        </span>
        <div className="min-w-0 flex-1">
          {title && <p className="truncate text-sm font-semibold">{title}</p>}
          <p
            className={`min-w-0 text-sm ${
              title ? "mt-0.5" : "pt-1 font-medium"
            }`}
          >
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg opacity-60 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Close notification"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default Toast;
