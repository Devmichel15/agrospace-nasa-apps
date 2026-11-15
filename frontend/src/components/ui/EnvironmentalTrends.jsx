import { BarChart3, CloudRain } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "./EmptyState";
import { formatDate, formatNumber } from "../../lib/agro";

export const EnvironmentalTrends = ({
  loading = false,
  hasData = false,
  forecast = [],
  source,
}) => {
  return (
    <section className="mt-8">
      <SectionHeader
        title="Tendências ambientais"
        subtitle="Previsão diária devolvida pelo serviço meteorológico"
      />
      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        {loading ? (
          <div className="flex items-center gap-3 p-6 text-sm text-[var(--color-text-secondary)]">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
            A carregar a previsão...
          </div>
        ) : hasData && forecast.length > 0 ? (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between gap-2 text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                <span className="text-sm">Próximos dias</span>
              </div>
              {source && <span className="text-xs">Fonte: {source}</span>}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {forecast.map((day) => (
                <div
                  key={day.date}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4"
                >
                  <p className="text-sm font-medium capitalize">
                    {formatDate(day.date)}
                  </p>
                  <p className="mt-2 text-2xl font-display font-semibold">
                    {formatNumber(day.temp_max_c)}°
                    <span className="ml-1 text-sm font-normal text-[var(--color-text-secondary)]">
                      / {formatNumber(day.temp_min_c)}°C
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                    <CloudRain size={14} />
                    {formatNumber(day.rain_mm)} mm
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="Sem previsão disponível"
            description="Não foi possível obter a previsão para esta exploração. Verifique as coordenadas ou tente novamente mais tarde."
          />
        )}
      </div>
    </section>
  );
};
