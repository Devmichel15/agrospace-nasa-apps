import { Inbox } from 'lucide-react';

export const EmptyState = ({ 
  icon: Icon = Inbox,
  title = "Sem dados disponíveis",
  description = "Não existem dados para apresentar neste momento.",
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <div className="w-12 h-12 rounded-2xl bg-[var(--color-warm-bg)] border border-[var(--color-border)] flex items-center justify-center mb-3">
        <Icon size={20} className="text-[var(--color-text-secondary)]" />
      </div>
      <h3 className="font-display font-semibold text-[var(--color-text-primary)] mb-1">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium hover:border-[var(--color-fresh-green)]/40 hover:shadow-sm transition-all duration-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
