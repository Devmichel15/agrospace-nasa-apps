import { DataOriginBadge } from './DataOriginBadge';
import { StatusIndicator } from './StatusIndicator';

export const InfoCard = ({ title, subtitle, status = 'ok', origin = 'OBSERVADO', description, action, onAction }) => {
  return (
    <article className="bg-[var(--color-card-bg)] border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <header className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <DataOriginBadge origin={origin} />
          <StatusIndicator status={status} />
        </div>
        {action && (
          <button onClick={onAction} className="text-sm font-semibold text-[var(--color-accent)] hover:underline">
            {action}
          </button>
        )}
      </header>
      <div>
        {title && <h4 className="font-semibold text-[var(--color-text-dark)] mb-1">{title}</h4>}
        {subtitle && <p className="text-sm text-[var(--color-text-muted)] mb-1">{subtitle}</p>}
        {description && <p className="text-sm text-[var(--color-text-dark)]">{description}</p>}
      </div>
    </article>
  );
};
