
export const MetricCard = ({ 
  title, 
  value, 
  unit, 
  subtitle, 
  status = 'ok', 
  origin = 'OBSERVADO',
  icon: Icon,
  trend,
  trendValue,
  children 
}) => {
  const statusColors = {
    ok: 'text-[var(--color-status-green)]',
    good: 'text-[var(--color-status-green)]',
    attention: 'text-[var(--color-status-yellow)]',
    warning: 'text-[var(--color-status-yellow)]',
    danger: 'text-[var(--color-status-red)]',
    bad: 'text-[var(--color-status-red)]',
    none: 'text-[var(--color-status-gray)]',
    nodata: 'text-[var(--color-status-gray)]',
  };

  const originStyles = {
    SENSOR: 'bg-[var(--color-tag-sensor-bg)] text-[var(--color-tag-sensor-text)]',
    OBSERVADO: 'bg-[var(--color-tag-observado-bg)] text-[var(--color-tag-observado-text)]',
    PREVISÃO: 'bg-[var(--color-tag-previsao-bg)] text-[var(--color-tag-previsao-text)]',
    PREVISAO: 'bg-[var(--color-tag-previsao-bg)] text-[var(--color-tag-previsao-text)]',
    ESTIMADO: 'bg-[var(--color-tag-estimado-bg)] text-[var(--color-tag-estimado-text)]',
  };

  return (
    <article className="group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[var(--color-fresh-green)]/40 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-[var(--color-warm-bg)] flex items-center justify-center border border-[var(--color-border)]">
              <Icon size={18} className={statusColors[status]} />
            </div>
          )}
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${originStyles[origin] || originStyles.OBSERVADO}`}>
            {origin === 'PREVISAO' ? 'PREVISÃO' : origin}
          </span>
        </div>
        {trend && trendValue && (
          <div className={`text-xs font-medium ${
            trend === 'up' ? 'text-[var(--color-status-green)]' : 
            trend === 'down' ? 'text-[var(--color-status-yellow)]' : 
            'text-[var(--color-text-secondary)]'
          }`}>
            {trendValue}
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{title}</h3>
        <div className="flex items-baseline gap-1.5">
          {value !== undefined && value !== null && (
            <span className="text-2xl font-display font-semibold text-[var(--color-text-primary)] tracking-tight">{value}</span>
          )}
          {unit && <span className="text-sm text-[var(--color-text-secondary)]">{unit}</span>}
        </div>
      </div>
      
      {(subtitle) && (
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{subtitle}</p>
      )}
      
      {children}
    </article>
  );
};
