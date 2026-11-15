import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CloudRain, Droplets, Sprout } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { FarmSelector } from "../../components/ui/FarmSelector";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState, InlineNotice, LoadingState } from "../../components/ui/PageState";
import { DataOriginBadge } from "../../components/ui/shared/DataOriginBadge";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import {
  findFactor,
  formatDate,
  formatNumber,
  statusBadge,
  statusLabel,
  sumForecastRain,
} from "../../lib/agro";

export const ChuvaDetalhePage = () => {
  const navigate = useNavigate();
  const { activeFarm, loading: farmsLoading } = useFarm();
  const [weather, setWeather] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    if (!activeFarm) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const [weatherData, analysisData] = await Promise.all([
        api.getFarmWeather(activeFarm.id),
        api.getFarmAnalysis(activeFarm.id).catch(() => null),
      ]);
      setWeather(weatherData);
      setAnalysis(analysisData);
    } catch (err) {
      setError(err.message || "Não foi possível obter os dados de chuva.");
      setWeather(null);
      if (err.status === 400) {
        setNotice("Adicione coordenadas à exploração para consultar a chuva.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeFarm]);

  useEffect(() => {
    if (!farmsLoading) load();
  }, [farmsLoading, load]);

  const rainFactor = findFactor(analysis, "rainfall_mm_7d");
  const forecastFactor = findFactor(analysis, "forecast_rain_mm");
  const forecastRain = sumForecastRain(weather?.forecast);

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Meteorologia
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Chuva
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Chuva observada na última semana e chuva prevista para os próximos
          dias.
        </p>
      </header>

      <div className="mb-6">
        <FarmSelector />
      </div>

      {farmsLoading || loading ? (
        <LoadingState label="A obter dados de chuva..." />
      ) : error ? (
        <>
          {notice && <InlineNotice>{notice}</InlineNotice>}
          <div className="mt-4">
            <ErrorState message={error} onRetry={load} />
          </div>
        </>
      ) : !activeFarm ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={Sprout}
            title="Sem exploração selecionada"
            description="Crie uma exploração para consultar dados de chuva."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : weather ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CloudRain size={18} className="text-[var(--color-primary)]" />
                  <h2 className="font-display text-lg font-semibold">
                    Acumulado da semana
                  </h2>
                </div>
                <DataOriginBadge origin="OBSERVADO" />
              </div>
              <p className="mb-2 text-3xl font-display font-semibold">
                {formatNumber(weather.rainfall_mm_7d)} mm
                {rainFactor && (
                  <span
                    className={`ml-2 inline-flex items-center rounded-full px-2.5 py-1 align-middle text-xs font-medium ${statusBadge(rainFactor.status === "good" ? "favorable" : rainFactor.status === "warning" ? "attention" : "risk")}`}
                  >
                    {statusLabel(
                      rainFactor.status === "good"
                        ? "favorable"
                        : rainFactor.status === "warning"
                          ? "attention"
                          : "risk",
                    )}
                  </span>
                )}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {rainFactor?.message ||
                  "Sem avaliação da chuva para esta cultura."}
              </p>
              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                Fonte: {weather.source}. O backend não fornece comparação
                histórica plurianual; apenas o acumulado observado.
              </p>
            </article>

            <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Droplets size={18} className="text-[var(--color-primary)]" />
                  <h2 className="font-display text-lg font-semibold">
                    Previsão diária
                  </h2>
                </div>
                <DataOriginBadge origin="PREVISAO" />
              </div>
              {weather.forecast?.length ? (
                <ul className="divide-y divide-[var(--color-border)]">
                  {weather.forecast.map((day) => (
                    <li
                      key={day.date}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <span className="capitalize">{formatDate(day.date)}</span>
                      <span className="text-[var(--color-text-secondary)]">
                        {formatNumber(day.temp_min_c)}° / {formatNumber(day.temp_max_c)}°
                      </span>
                      <span className="font-medium">
                        {formatNumber(day.rain_mm)} mm
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <InlineNotice>
                  A previsão não está disponível neste momento (fonte de dados
                  alternativa sem previsão).
                </InlineNotice>
              )}
              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                Total previsto: {formatNumber(forecastRain)} mm
                {forecastFactor ? ` · ${forecastFactor.message}` : ""}
              </p>
            </article>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg font-semibold">
              Resumo rápido
            </h2>
            <div className="space-y-3">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Chuva atual
                </p>
                <p className="text-2xl font-display font-semibold">
                  {formatNumber(weather.current?.rain_mm)} mm
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Humidade do ar
                </p>
                <p className="text-2xl font-display font-semibold">
                  {formatNumber(weather.current?.humidity_pct, 0)}%
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Temperatura atual
                </p>
                <p className="text-2xl font-display font-semibold">
                  {formatNumber(weather.current?.temperature_c)} °C
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={CloudRain}
          title="Sem dados de chuva"
          description="Não foi possível obter os dados para esta exploração."
          actionLabel="Tentar novamente"
          onAction={load}
        />
      )}
    </AppLayout>
  );
};
