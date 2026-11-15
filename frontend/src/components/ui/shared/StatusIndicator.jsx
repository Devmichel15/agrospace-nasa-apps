import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaQuestionCircle } from 'react-icons/fa';

const statusMap = {
  ok: { color: 'var(--color-status-green)', Icon: FaCheckCircle, text: 'Tudo bem' },
  good: { color: 'var(--color-status-green)', Icon: FaCheckCircle, text: 'Tudo bem' },
  attention: { color: 'var(--color-status-yellow)', Icon: FaExclamationTriangle, text: 'Atenção' },
  warning: { color: 'var(--color-status-yellow)', Icon: FaExclamationTriangle, text: 'Atenção' },
  danger: { color: 'var(--color-status-red)', Icon: FaTimesCircle, text: 'Perigo' },
  bad: { color: 'var(--color-status-red)', Icon: FaTimesCircle, text: 'Perigo' },
  none: { color: 'var(--color-status-gray)', Icon: FaQuestionCircle, text: 'Sem dados' },
  nodata: { color: 'var(--color-status-gray)', Icon: FaQuestionCircle, text: 'Sem dados' },
};

export const StatusIndicator = ({ status = 'ok', showText = false, size = 12 }) => {
  const cfg = statusMap[status] || statusMap.ok;
  const Icon = cfg.Icon;
  return (
    <div className="flex items-center gap-1.5" title={cfg.text}>
      <Icon style={{ color: cfg.color, fontSize: size }} aria-hidden="true" />
      {showText && <span className="text-xs text-[var(--color-text-dark)]">{cfg.text}</span>}
    </div>
  );
};
