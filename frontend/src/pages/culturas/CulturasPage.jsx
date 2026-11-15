import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertTriangle, Sprout } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState, LoadingState } from "../../components/ui/PageState";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import { cropLabel, statusBadge, statusLabel } from "../../lib/agro";

export const CulturasPage = () => {
  const navigate = useNavigate();
  const {
    farms,
    activeFarm,
    loading: farmsLoading,
    error: farmsError,
    refresh,
  } = useFarm();
  const [analyses, setAnalyses] = useState({});
  const analysesRef = useRef({});
  const inFlight = useRef(new Set());

  const setEntry = useCallback((farmId, entry) => {
    analysesRef.current = { ...analysesRef.current, [farmId]: entry };
    setAnalyses(analysesRef.current);
  }, []);

  const loadFarm = useCallback(
    async (farmId, force = false) => {
      if (!farmId || inFlight.current.has(farmId)) return;
      const current = analysesRef.current[farmId];
      if (!force && (current?.status === "done" || current?.status === "loading")) {
        return;
      }
      inFlight.current.add(farmId);
      setEntry(farmId, {
        status: "loading",
        data: current?.data ?? null,
        error: "",
      });
      try {
        const analysis = await api.getFarmAnalysis(farmId);
        setEntry(farmId, { status: "done", data: analysis, error: "" });
      } catch (err) {
        setEntry(farmId, {
          status: "error",
          data: null,
          error: err.message || "Análise indisponível.",
        });
      } finally {
        inFlight.current.delete(farmId);
      }
    },
    [setEntry],
  );

  useEffect(() => {
    if (activeFarm?.id) loadFarm(activeFarm.id);
  }, [activeFarm?.id, loadFarm]);

  if (farmsLoading && !farms.length) {
    return (
      <AppLayout>
        <LoadingState label="A carregar as suas explorações..." />
      </AppLayout>
    );
  }

  if (farmsError) {
    return (
      <AppLayout>
        <ErrorState message={farmsError} onRetry={refresh} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="mb-10">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Análise comparativa
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Culturas
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Adequação por cultura com fatores, riscos e limitações calculados a
          partir dos dados reais de cada exploração.
        </p>
      </header>

      {!farms.length ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={Sprout}
            title="Ainda não há explorações"
            description="Crie uma exploração para calcular a adequação das culturas."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : (
        <>
          <SectionHeader
            title="Adequação por cultura"
            subtitle={`${farms.length} exploração(ões) · a ativa é analisada automaticamente`}
          />
          <div className="space-y-3">
            {farms.map((farm) => {
              const entry = analyses[farm.id] || { status: "idle" };
              const analysis = entry.data;
              const isLoading = entry.status === "loading";
              const isError = entry.status === "error";
              const isIdle = entry.status === "idle";
              const favorable = (analysis?.factors || []).filter(
                (factor) => factor.status === "good",
              );
              const attention = (analysis?.factors || []).filter(
                (factor) => factor.status !== "good",
              );
              return (
                <article
                  key={farm.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:border-[var(--color-fresh-green)]/40 hover:shadow-md"
                >
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)]">
                        <Sprout size={18} className="text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold">
                          {cropLabel(farm.crop)}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {farm.name}
                          {activeFarm?.id === farm.id ? " · ativa" : ""}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        isError
                          ? statusBadge("risk")
                          : isIdle
                            ? "border border-[var(--color-border)] bg-[var(--color-warm-bg)] text-[var(--color-text-secondary)]"
                            : statusBadge(analysis?.status)
                      }`}
                    >
                      {isIdle
                        ? "Por analisar"
                        : isLoading && !analysis
                          ? "A analisar..."
                          : isError
                            ? "Sem dados"
                            : statusLabel(analysis?.status)}
                    </span>
                  </div>

                  {isLoading && !analysis ? (
                    <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-3 text-sm text-[var(--color-text-secondary)]">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
                      A calcular fatores, solo e clima...
                    </div>
                  ) : isError ? (
                    <div className="rounded-xl border border-[rgba(217,91,80,0.35)] bg-[rgba(217,91,80,0.06)] p-3">
                      <p className="flex items-center gap-2 text-sm font-medium text-[var(--color-danger)]">
                        <AlertTriangle size={15} />
                        Análise indisponível
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {entry.error}
                      </p>
                      <button
                        type="button"
                        onClick={() => loadFarm(farm.id, true)}
                        className="mt-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-deep-green)]"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : isIdle ? (
                    <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        A análise usa NASA POWER, Solo e previsão e pode demorar
                        alguns segundos.
                      </p>
                      <button
                        type="button"
                        onClick={() => loadFarm(farm.id)}
                        className="shrink-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:border-[var(--color-fresh-green)]/40"
                      >
                        Analisar agora
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-3">
                        <p className="mb-1 text-sm font-medium">Fatores favoráveis</p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {favorable.length
                            ? favorable.map((factor) => factor.message).join(" ")
                            : "Nenhum fator favorável identificado."}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-3">
                        <p className="mb-1 text-sm font-medium">
                          Pontos de atenção
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {attention.length
                            ? attention.map((factor) => factor.message).join(" ")
                            : "Sem pontos de atenção."}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      Confiança: {analysis?.confidence || "sem dados"}
                    </span>
                    {analysis ? (
                      <Link
                        to={`/interpretacao?farm=${farm.id}`}
                        className="text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-deep-green)]"
                      >
                        Porquê esta resposta?
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </AppLayout>
  );
};
