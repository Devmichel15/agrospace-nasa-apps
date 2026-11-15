import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, CloudRain, Sprout, Sun } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { FarmSelector } from "../../components/ui/FarmSelector";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState, InlineNotice, LoadingState } from "../../components/ui/PageState";
import { DataOriginBadge } from "../../components/ui/shared/DataOriginBadge";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import { formatDate, formatNumber } from "../../lib/agro";

export const Previsao7DiasPage = () => {
  const navigate = useNavigate();
  const { activeFarm, loading: farmsLoading } = useFarm();
  const [weather, setWeather] = useState(null);
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
      const data = await api.getFarmWeather(activeFarm.id);
      setWeather(data);
    } catch (err) {
      setError(err.message || "Não foi possível obter a previsão.");
      setWeather(null);
      if (err.status === 400) {
        setNotice("Adicione coordenadas à exploração para ver a previsão.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeFarm]);

  useEffect(() => {
    if (!farmsLoading) load();
  }, [farmsLoading, load]);

  const forecast = weather?.forecast || [];

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Meteorologia
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Previsão
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Projeção meteorológica para os próximos dias, a partir da exploração
          selecionada.
        </p>
      </header>

      <div className="mb-6">
        <FarmSelector />
      </div>

      {farmsLoading || loading ? (
        <LoadingState label="A obter a previsão..." />
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
            description="Crie uma exploração para consultar a previsão."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : weather ? (
        <div className="space-y-6">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sun size={18} className="text-[var(--color-primary)]" />
                <h2 className="font-display text-lg font-semibold">
                  Condições atuais
                </h2>
              </div>
              <DataOriginBadge origin="OBSERVADO" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Temperatura
                </p>
                <p className="text-2xl font-display font-semibold">
                  {formatNumber(weather.current?.temperature_c)} °C
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Humidade
                </p>
                <p className="text-2xl font-display font-semibold">
                  {formatNumber(weather.current?.humidity_pct, 0)}%
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Chuva atual
                </p>
                <p className="text-2xl font-display font-semibold">
                  {formatNumber(weather.current?.rain_mm)} mm
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
              Fonte: {weather.source}.
            </p>
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CloudRain size={18} className="text-[var(--color-primary)]" />
                <h2 className="font-display text-lg font-semibold">
                  Próximos dias
                </h2>
              </div>
              <DataOriginBadge origin="PREVISAO" />
            </div>
            {forecast.length ? (
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
                    {Number(day.rain_mm) >= 20 && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[var(--color-warning)]">
                        <AlertTriangle size={14} />
                        Chuva significativa
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <InlineNotice>
                A previsão não está disponível neste momento. A fonte
                alternativa (NASA POWER) só fornece dados observados, sem
                previsão.
              </InlineNotice>
            )}
            <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
              O backend devolve 3 dias de previsão (hoje incluído). A incerteza
              aumenta com o horizonte temporal.
            </p>
          </article>
        </div>
      ) : (
        <EmptyState
          icon={CloudRain}
          title="Sem previsão disponível"
          description="Não foi possível obter a previsão para esta exploração."
          actionLabel="Tentar novamente"
          onAction={load}
        />
      )}
    </AppLayout>
  );
};
