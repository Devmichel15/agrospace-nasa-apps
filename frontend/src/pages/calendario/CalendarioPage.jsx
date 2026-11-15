import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Clock, Sprout } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { FarmSelector } from "../../components/ui/FarmSelector";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState, InlineNotice, LoadingState } from "../../components/ui/PageState";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import { buildCalendarEvents, cropLabel, formatDate } from "../../lib/agro";

const RISK_STYLES = {
  low: "bg-[rgba(37,134,83,0.12)] text-[var(--color-success)]",
  medium: "bg-[rgba(233,162,59,0.16)] text-[var(--color-warning)]",
  high: "bg-[rgba(217,91,80,0.12)] text-[var(--color-danger)]",
};

const RISK_LABELS = { low: "Risco baixo", medium: "Risco médio", high: "Risco alto" };

const TYPE_LABELS = { plant: "Plantio", care: "Manejo", harvest: "Colheita" };

export const CalendarioPage = () => {
  const navigate = useNavigate();
  const { activeFarm, loading: farmsLoading } = useFarm();
  const [events, setEvents] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    if (!activeFarm) {
      setEvents([]);
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
      setEvents(buildCalendarEvents(analysis, weather, activeFarm));
      setNote(
        "Janelas indicativas geradas por regras a partir de meteorologia, solo e dados NASA.",
      );
    } catch (err) {
      setError(err.message || "Não foi possível gerar o calendário.");
      setEvents([]);
      if (err.status === 400) {
        setNotice("Adicione coordenadas à exploração para gerar o calendário.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeFarm]);

  useEffect(() => {
    if (!farmsLoading) load();
  }, [farmsLoading, load]);

  return (
    <AppLayout>
      <header className="mb-10">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Planeamento agrícola
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Calendário
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Janelas indicativas de plantio, manejo e acompanhamento calculadas com
          os dados atuais da exploração.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FarmSelector />
        {activeFarm && (
          <span className="text-sm text-[var(--color-text-secondary)]">
            Cultura: {cropLabel(activeFarm.crop)}
          </span>
        )}
      </div>

      {farmsLoading || loading ? (
        <LoadingState label="A calcular janelas de manejo..." />
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
            description="Crie uma exploração para gerar o calendário agrícola."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={Calendar}
            title="Sem eventos para apresentar"
            description="Não foi possível gerar janelas com os dados atuais."
            actionLabel="Tentar novamente"
            onAction={load}
          />
        </div>
      ) : (
        <>
          <SectionHeader
            title="Linha temporal"
            subtitle="Ações sugeridas com base nas condições interpretadas"
          />
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-[var(--color-border)] sm:block" />
            <div className="space-y-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:ml-10"
                >
                  <div className="absolute -left-14 top-6 hidden h-8 w-8 items-center justify-center rounded-full border border-[rgba(37,134,83,0.4)] bg-[rgba(37,134,83,0.16)] sm:flex">
                    <Calendar size={16} className="text-[var(--color-success)]" />
                  </div>
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-display text-lg font-semibold">
                      {formatDate(event.start)} a {formatDate(event.end)} ·{" "}
                      {event.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${RISK_STYLES[event.risk] || RISK_STYLES.low}`}
                    >
                      {RISK_LABELS[event.risk] || event.risk}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {event.reason}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <Clock size={14} />
                    <span>{TYPE_LABELS[event.type] || event.type}</span>
                    <span>·</span>
                    <span>{event.sources.join(", ")}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
          {note && (
            <p className="mt-4 text-xs text-[var(--color-text-secondary)]">{note}</p>
          )}
        </>
      )}
    </AppLayout>
  );
};
