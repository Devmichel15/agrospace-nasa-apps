
export const SectionHeader = ({ 
  title, 
  subtitle, 
  action, 
  onAction,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4 ${className}`}>
      <div>
        <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--color-text-primary)] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <button 
          onClick={onAction}
          className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-deep-green)] transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  );
};
