import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  Cpu,
  Droplet,
  Droplets,
  Info,
  MapPin,
  Sprout,
  Thermometer,
} from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { FarmSelector } from "../../components/ui/FarmSelector";
import { EmptyState } from "../../components/ui/EmptyState";
import {
  ErrorState,
  InlineNotice,
  LoadingState,
} from "../../components/ui/PageState";
import { DataOriginBadge } from "../../components/ui/shared/DataOriginBadge";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import { formatNumber } from "../../lib/agro";

const DataRow = ({ label, value, unit }) => (
  <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] py-2 text-sm">
    <span className="text-[var(--color-text-secondary)]">{label}</span>
    <span className="font-medium">
      {formatNumber(value)}
      {unit && value !== null && value !== undefined ? ` ${unit}` : ""}
    </span>
  </div>
);

export const SensoresPage = () => {
  const navigate = useNavigate();
  const { activeFarm, loading: farmsLoading } = useFarm();
  const [soil, setSoil] = useState(null);
  const [nasa, setNasa] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [noCoords, setNoCoords] = useState(false);

  async function getDataESP() {
    console.log("teste");
    const apiURL = "10.137.188.54";
    // const data = await fetch(apiURL);
    // const jsonData = await data.json();
    setSoil({
      temp: 33.6,
      humidity: 77.6,
    })
    console.log(soil);
  }

  const load = useCallback(async () => {
    if (!activeFarm) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrors({});
    setNoCoords(false);
    const [nasaResult] = await Promise.allSettled([
      api.getFarmNasa(activeFarm.id),
    ]);
    setNasa(nasaResult.status === "fulfilled" ? nasaResult.value : null);
    const nextErrors = {};

    if (nasaResult.status === "rejected") {
      nextErrors.nasa = nasaResult.reason?.message;
    }
    if (nasaResult.status === "rejected" && nasaResult.reason?.status === 400) {
      setNoCoords(true);
    }
    setErrors(nextErrors);
    setLoading(false);
    getDataESP();
  }, [activeFarm]);

  useEffect(() => {
    if (!farmsLoading) load();
  }, [farmsLoading, load]);

  return (
    <AppLayout>
      <header className="mb-8">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Monitorização
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Sensores
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Estado dos aparelhos instalados e indicadores ambientais estimados.
        </p>
      </header>

      <div className="mb-6">
        <FarmSelector />
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] p-4">
        <Info
          size={18}
          className="mt-0.5 shrink-0 text-[var(--color-primary)]"
        />
        <div>
          <p className="text-sm font-medium">Sem sensores ligados</p>
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
            Esta conta ainda não tem sensores físicos associados. Os valores
            abaixo são estimativas de satélite e modelos globais, identificadas
            pela origem de cada fonte — não são leituras de campo.
          </p>
        </div>
      </div>

      {farmsLoading || loading ? (
        <LoadingState label="A obter indicadores ambientais..." />
      ) : !activeFarm ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={Sprout}
            title="Sem exploração selecionada"
            description="Crie uma exploração para consultar os indicadores disponíveis."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
      ) : noCoords ? (
        <div className="space-y-4">
          <InlineNotice>
            Esta exploração não tem coordenadas. A monitorização por satélite e
            solo requer latitude e longitude.
          </InlineNotice>
          <EmptyState
            icon={MapPin}
            title="Faltam coordenadas"
            description="Edite a exploração no perfil para adicionar a localização."
            actionLabel="Ir para o perfil"
            onAction={() => navigate("/perfil")}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-[var(--color-primary)]" />
                <h2 className="font-display text-lg font-semibold">
                  Solo (hardware)
                </h2>
              </div>
              <DataOriginBadge origin="ESTIMADO" />
            </div>
            {soil ? (
              <>
                <DataRow
                  label="Temperatura"
                  value={soil.temp}
                  unit="°C"
                />
                <DataRow
                  label="Humidade relativa"
                  value={soil.humidity}
                  unit="%"
                />
              </>
            ) : (
              <div className="mt-2">
                <ErrorState message={"Dados não encontrados"} onRetry={load} />
                {soil}
              </div>
            )}
          </article>

          <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-[var(--color-primary)]" />
                <h2 className="font-display text-lg font-semibold">
                  NASA POWER
                </h2>
              </div>
              <DataOriginBadge origin="OBSERVADO" />
            </div>
            {nasa ? (
              <>
                <DataRow
                  label="Temperatura"
                  value={nasa.temperature_c}
                  unit="°C"
                />
                <DataRow
                  label="Humidade relativa"
                  value={nasa.humidity_pct}
                  unit="%"
                />
                <DataRow
                  label="Chuva (7 dias)"
                  value={nasa.rainfall_mm_7d}
                  unit="mm"
                />
                <DataRow
                  label="Humidade da zona radicular"
                  value={nasa.root_zone_wetness}
                />
                <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
                  Fonte: {nasa.source} · Último dia com dados:{" "}
                  {nasa.latest_date}. Resolução ~50 km, com atraso de alguns
                  dias.
                </p>
              </>
            ) : (
              <div className="mt-2">
                <ErrorState
                  message={errors.nasa || "Dados NASA indisponíveis."}
                  onRetry={load}
                />
              </div>
            )}
          </article>
        </div>
      )}
    </AppLayout>
  );
};
