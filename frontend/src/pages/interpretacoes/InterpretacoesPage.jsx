import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  MessageCircle,
  ShieldAlert,
  Sprout,
  XCircle,
} from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { FarmSelector } from "../../components/ui/FarmSelector";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState, LoadingState } from "../../components/ui/PageState";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import {
  buildAlerts,
  cropLabel,
  factorLabel,
  factorUnit,
  formatNumber,
  statusBadge,
  statusLabel,
} from "../../lib/agro";

const FACTOR_ICONS = {
  good: CheckCircle2,
  warning: AlertTriangle,
  risk: XCircle,
};

const FACTOR_COLORS = {
  good: "text-[var(--color-success)]",
  warning: "text-[var(--color-warning)]",
  risk: "text-[var(--color-danger)]",
};

const useActiveAnalysis = () => {
  const [searchParams] = useSearchParams();
  const { activeFarm, loading: farmsLoading } = useFarm();
  const requestedId = searchParams.get("farm");
  const farmId = requestedId || activeFarm?.id || null;
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!farmId) {
      setAnalysis(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      setAnalysis(await api.getFarmAnalysis(farmId));
    } catch (err) {
      setError(err.message || "Não foi possível obter a análise.");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  }, [farmId]);

  useEffect(() => {
    if (!farmsLoading) load();
  }, [farmsLoading, load]);

  return { analysis, loading: farmsLoading || loading, error, load, farmId };
};

export const InterpretacaoPage = () => {
  const navigate = useNavigate();
  const { analysis, loading, error, load } = useActiveAnalysis();

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Transparência
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Porquê esta resposta?
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Fatores que pesaram na avaliação, com valores, fontes e limitações.
        </p>
      </header>

      <div className="mb-6">
        <FarmSelector />
      </div>

      {loading ? (
        <LoadingState label="A carregar a explicação..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !analysis ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={Sprout}
            title="Sem análise disponível"
            description="Selecione ou crie uma exploração para ver a explicação."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    {cropLabel(analysis.farm?.crop)} · {analysis.farm?.name}
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Confiança: {analysis.confidence || "não indicada"}
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${statusBadge(analysis.status)}`}
                >
                  {statusLabel(analysis.status)}
                </span>
              </div>

              <p className="mb-4 text-sm font-medium">O que pesou:</p>
              <ul className="space-y-2">
                {(analysis.factors || []).map((factor) => {
                  const Icon = FACTOR_ICONS[factor.status] || Info;
                  return (
                    <li
                      key={factor.name}
                      className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-3"
                    >
                      <Icon
                        size={18}
                        className={`mt-0.5 shrink-0 ${FACTOR_COLORS[factor.status] || "text-[var(--color-text-secondary)]"}`}
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm font-medium">
                            {factorLabel(factor.name)}
                          </p>
                          <p className="text-sm font-semibold">
                            {formatNumber(factor.value)}{" "}
                            {factorUnit(factor.name)}
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                          {factor.message}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>

            <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <h2 className="mb-3 font-display text-lg font-semibold">
                Recomendações
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-text-secondary)]">
                {(analysis.recommendations || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                to="/chat"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-deep-green)]"
              >
                <MessageCircle size={16} />
                Perguntar ao assistente
                <ArrowRight size={14} />
              </Link>
            </article>
          </div>

          <div className="space-y-6">
            <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <h2 className="mb-3 font-display text-lg font-semibold">
                Limitações
              </h2>
              <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                {(analysis.limitations || []).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
              <h2 className="mb-3 font-display text-lg font-semibold">Fontes</h2>
              <ul className="flex flex-wrap gap-2">
                {(analysis.data_sources || []).map((source) => (
                  <li
                    key={source}
                    className="rounded-full border border-[var(--color-border)] bg-[var(--color-warm-bg)] px-3 py-1 text-xs font-medium"
                  >
                    {source}
                  </li>
                ))}
              </ul>
              {analysis.disclaimer && (
                <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
                  {analysis.disclaimer}
                </p>
              )}
            </article>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export const DadosInsuficientesPage = () => {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <header className="mb-8">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Transparência
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Dados insuficientes
        </h1>
      </header>
      <article className="mx-auto max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-warm-bg)]">
          <ShieldAlert size={22} className="text-[var(--color-warning)]" />
        </div>
        <p className="font-display text-lg font-semibold">
          O sistema admite que não sabe
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Faltam dados para calcular a adequação. Confirme se a exploração tem
          coordenadas e cultura definidas. Os sensores físicos ainda não estão
          integrados.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
          >
            Editar exploração
          </button>
          <button
            type="button"
            onClick={() => navigate("/sobre-dados")}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
          >
            Ver fontes e limites
          </button>
        </div>
      </article>
    </AppLayout>
  );
};

export const AlertasPage = () => {
  const navigate = useNavigate();
  const { analysis, loading, error, load } = useActiveAnalysis();
  const alerts = buildAlerts(analysis);
  const severityStyles = {
    danger: "border-[rgba(217,91,80,0.45)] bg-[rgba(217,91,80,0.06)]",
    attention: "border-[rgba(233,162,59,0.45)] bg-[rgba(233,162,59,0.06)]",
  };
  const severityLabels = { danger: "PERIGO", attention: "ATENÇÃO" };

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Monitorização
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Alertas
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Fatores de perigo e de atenção detetados na análise atual.
        </p>
      </header>

      <div className="mb-6">
        <FarmSelector />
      </div>

      {loading ? (
        <LoadingState label="A verificar alertas..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !analysis ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={Sprout}
            title="Sem exploração selecionada"
            description="Crie uma exploração para receber alertas."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : alerts.length === 0 ? (
        <article className="flex items-start gap-3 rounded-2xl border border-[rgba(37,134,83,0.35)] bg-[rgba(37,134,83,0.06)] p-5">
          <CheckCircle2
            size={20}
            className="mt-0.5 shrink-0 text-[var(--color-success)]"
          />
          <div>
            <p className="font-medium">Nenhum alerta ativo</p>
            <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
              Todos os fatores disponíveis estão dentro dos intervalos
              definidos. Continue a monitorizar.
            </p>
          </div>
        </article>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <article
              key={alert.id}
              className={`rounded-2xl border p-5 ${severityStyles[alert.severity] || severityStyles.attention}`}
            >
              <div className="mb-1 flex items-center gap-2">
                <AlertTriangle
                  size={16}
                  className={
                    alert.severity === "danger"
                      ? "text-[var(--color-danger)]"
                      : "text-[var(--color-warning)]"
                  }
                />
                <span
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    alert.severity === "danger"
                      ? "text-[var(--color-danger)]"
                      : "text-[var(--color-warning)]"
                  }`}
                >
                  {severityLabels[alert.severity] || "ATENÇÃO"}
                </span>
              </div>
              <p className="font-semibold">
                {alert.title}: {formatNumber(alert.value)} {alert.unit}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {alert.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </AppLayout>
  );
};
