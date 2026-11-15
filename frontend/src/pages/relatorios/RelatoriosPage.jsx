import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, FileText, Sprout } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { FarmSelector } from "../../components/ui/FarmSelector";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState, InlineNotice, LoadingState } from "../../components/ui/PageState";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import {
  buildReport,
  cropLabel,
  factorLabel,
  factorUnit,
  findFactor,
  formatDate,
  formatNumber,
  statusBadge,
  statusLabel,
} from "../../lib/agro";

export const RelatoriosPage = () => {
  const navigate = useNavigate();
  const { activeFarm, loading: farmsLoading } = useFarm();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    if (!activeFarm) {
      setReport(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const [analysis, weather] = await Promise.all([
        api.getFarmAnalysis(activeFarm.id),
        api.getFarmWeather(activeFarm.id).catch(() => null),
      ]);
      setReport(buildReport(analysis, weather, activeFarm));
    } catch (err) {
      setError(err.message || "Não foi possível gerar o relatório.");
      setReport(null);
      if (err.status === 400) {
        setNotice("Adicione coordenadas à exploração para gerar o relatório.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeFarm]);

  useEffect(() => {
    if (!farmsLoading) load();
  }, [farmsLoading, load]);

  const rainFactor = findFactor(
    report ? { factors: report.factors } : null,
    "rainfall_mm_7d",
  );

  return (
    <AppLayout>
      <header className="mb-10">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Análise e histórico
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Relatórios
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Resumo da semana com indicadores meteorológicos, solo e recomendações
          para a exploração selecionada.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FarmSelector />
        {activeFarm && (
          <span className="text-sm text-[var(--color-text-secondary)]">
            {cropLabel(activeFarm.crop)} · {activeFarm.name}
          </span>
        )}
      </div>

      {farmsLoading || loading ? (
        <LoadingState label="A preparar o resumo semanal..." />
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
            description="Crie uma exploração para gerar relatórios."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : !report ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={FileText}
            title="Sem relatório disponível"
            description="Não foi possível gerar o resumo com os dados atuais."
            actionLabel="Tentar novamente"
            onAction={load}
          />
        </div>
      ) : (
        <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SectionHeader
              title="Relatório da semana"
              subtitle={`${formatDate(report.periodFrom)} a ${formatDate(report.periodTo)}`}
            />
            <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-lg font-semibold">
                  {report.summary}
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadge(report.status)}`}
                >
                  {report.status === "risk" && <AlertTriangle size={14} />}
                  {statusLabel(report.status)}
                </span>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4 text-center">
                  <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
                    Chuva (7 dias)
                  </p>
                  <p className="text-2xl font-display font-semibold">
                    {formatNumber(report.rainfall)} mm
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {rainFactor?.message || "Sem comparação histórica disponível."}
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4 text-center">
                  <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
                    Temperatura atual
                  </p>
                  <p className="text-2xl font-display font-semibold">
                    {formatNumber(report.temperature)} °C
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Humidade do ar: {formatNumber(report.humidity, 0)}%
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4 text-center">
                  <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
                    Chuva prevista
                  </p>
                  <p className="text-2xl font-display font-semibold">
                    {formatNumber(report.forecastRain)} mm
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Próximos dias
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Indicadores</p>
                {report.factors.map((factor) => (
                  <div
                    key={factor.name}
                    className="flex flex-col gap-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {factorLabel(factor.name)}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {factor.message}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatNumber(factor.value)}{" "}
                      {factorUnit(factor.name)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-sm font-medium">Recomendações</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-text-secondary)]">
                  {report.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <div>
            <SectionHeader
              title="Limitações e fontes"
              subtitle="Transparência dos dados usados"
            />
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              <div className="divide-y divide-[var(--color-border)]">
                {report.sources.map((source) => (
                  <div key={source} className="flex items-start gap-3 p-4">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(37,134,83,0.16)]">
                      <FileText size={16} className="text-[var(--color-success)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{source}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                        Fonte consultada para este relatório.
                      </p>
                    </div>
                  </div>
                ))}
                {report.limitations.map((item) => (
                  <div key={item} className="p-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {report.disclaimer && (
              <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                {report.disclaimer}
              </p>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
};
