import { AlertTriangle, RefreshCw } from "lucide-react";

export const LoadingState = ({ label = "A carregar dados..." }) => (
  <div className="space-y-4" role="status" aria-live="polite">
    <div className="h-5 w-48 animate-pulse rounded-lg bg-[var(--color-border)]" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
      ))}
    </div>
    <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div
    className="flex flex-col items-start gap-3 rounded-2xl border border-[rgba(217,91,80,0.45)] bg-[rgba(217,91,80,0.08)] p-5"
    role="alert"
  >
    <div className="flex items-center gap-2 text-[var(--color-danger)]">
      <AlertTriangle size={18} />
      <p className="font-medium">Não foi possível carregar os dados</p>
    </div>
    <p className="text-sm text-[var(--color-text-primary)]">
      {message || "Ocorreu um erro inesperado."}
    </p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <RefreshCw size={16} />
        Tentar novamente
      </button>
    )}
  </div>
);

export const InlineNotice = ({ children }) => (
  <p className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
    {children}
  </p>
);
