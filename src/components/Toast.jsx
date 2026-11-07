import { useApp } from "../context/useApp";

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-800 dark:border-slate-200 text-xs sm:text-sm font-semibold tracking-wide">
        {toast.type === "success" ? (
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 dark:text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </span>
        ) : (
          <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 dark:text-rose-600 flex items-center justify-center font-bold">
            •
          </span>
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
