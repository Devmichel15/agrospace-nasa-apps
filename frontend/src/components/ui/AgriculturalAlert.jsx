import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const severityConfig = {
  info: {
    icon: Info,
    bg: 'bg-blue-50/40',
    border: 'border-blue-200/60',
    iconBg: 'bg-blue-100/70',
    iconColor: 'text-blue-700',
    titleColor: 'text-blue-900',
  },
  attention: {
    icon: AlertTriangle,
    bg: 'bg-[rgba(233,162,59,0.08)]',
    border: 'border-[rgba(233,162,59,0.45)]',
    iconBg: 'bg-[rgba(233,162,59,0.16)]',
    iconColor: 'text-[var(--color-warning)]',
    titleColor: 'text-[#7C4A12]',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[rgba(233,162,59,0.08)]',
    border: 'border-[rgba(233,162,59,0.45)]',
    iconBg: 'bg-[rgba(233,162,59,0.16)]',
    iconColor: 'text-[var(--color-warning)]',
    titleColor: 'text-[#7C4A12]',
  },
  danger: {
    icon: AlertCircle,
    bg: 'bg-[rgba(217,91,80,0.08)]',
    border: 'border-[rgba(217,91,80,0.45)]',
    iconBg: 'bg-[rgba(217,91,80,0.16)]',
    iconColor: 'text-[var(--color-danger)]',
    titleColor: 'text-[#7F1D1D]',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-[rgba(37,134,83,0.08)]',
    border: 'border-[rgba(37,134,83,0.45)]',
    iconBg: 'bg-[rgba(37,134,83,0.16)]',
    iconColor: 'text-[var(--color-success)]',
    titleColor: 'text-[#14532D]',
  },
};

export const AgriculturalAlert = ({ 
  severity = 'attention', 
  title, 
  description, 
  timestamp, 
  confidence,
  actionLabel,
  onAction 
}) => {
  const config = severityConfig[severity] || severityConfig.attention;
  const Icon = config.icon;

  return (
    <section className={`relative overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-5 shadow-sm`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={config.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
            <h2 className={`font-display font-semibold text-lg ${config.titleColor} tracking-tight`}>{title}</h2>
            {actionLabel && (
              <button 
                onClick={onAction}
                className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-deep-green)] transition-colors whitespace-nowrap"
              >
                {actionLabel}
              </button>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed mb-3">{description}</p>
          {(timestamp || confidence) && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              {timestamp && <span>{timestamp}</span>}
              {confidence && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>Confiança: {confidence}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
