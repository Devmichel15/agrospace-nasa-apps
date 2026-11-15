
const originStyles = {
  SENSOR: { bg: 'bg-[var(--color-tag-sensor-bg)]', text: 'text-[var(--color-tag-sensor-text)]', label: 'SENSOR' },
  OBSERVADO: { bg: 'bg-[var(--color-tag-observado-bg)]', text: 'text-[var(--color-tag-observado-text)]', label: 'OBSERVADO' },
  PREVISÃO: { bg: 'bg-[var(--color-tag-previsao-bg)]', text: 'text-[var(--color-tag-previsao-text)]', label: 'PREVISÃO' },
  PREVISAO: { bg: 'bg-[var(--color-tag-previsao-bg)]', text: 'text-[var(--color-tag-previsao-text)]', label: 'PREVISÃO' },
  ESTIMADO: { bg: 'bg-[var(--color-tag-estimado-bg)]', text: 'text-[var(--color-tag-estimado-text)]', label: 'ESTIMADO' },
};

export const DataOriginBadge = ({ origin = 'OBSERVADO' }) => {
  const style = originStyles[origin] || originStyles.OBSERVADO;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
};
