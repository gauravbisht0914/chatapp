function Toast({ type = "success", message, onClose }) {
  const isError = type === "error";

  return (
    <div
      className={`page-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg ${
        isError
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
      role="alert"
      aria-live="polite"
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isError ? "bg-red-100" : "bg-emerald-100"
        }`}
        aria-hidden="true"
      >
        {isError ? "!" : "✓"}
      </span>
      <p className="min-w-0 flex-1 pt-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg opacity-60 transition hover:bg-black/5 hover:opacity-100"
        aria-label="Close notification"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

export default Toast;
