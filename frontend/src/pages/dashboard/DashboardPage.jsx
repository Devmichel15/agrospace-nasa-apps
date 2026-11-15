import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Activity, CloudRain, Droplets, Plus, Sprout } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { AgriculturalAlert } from "../../components/ui/AgriculturalAlert";
import { MetricCard } from "../../components/ui/MetricCard";
import { FarmOverview } from "../../components/ui/FarmOverview";
import { QuickActions } from "../../components/ui/QuickActions";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { EnvironmentalTrends } from "../../components/ui/EnvironmentalTrends";
import { FarmHero } from "../../components/ui/FarmHero";
import { DashboardHeader } from "../../components/layout/DashboardHeader";
import { FarmSelector } from "../../components/ui/FarmSelector";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState, LoadingState } from "../../components/ui/PageState";
import { useAuth } from "../../context/AuthContext";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import {
  cropLabel,
  findFactor,
  formatNumber,
  statusSeverity,
  sumForecastRain,
} from "../../lib/agro";

const metricStatus = (factor) => {
  if (!factor) return "none";
  if (factor.status === "good") return "ok";
  if (factor.status === "risk") return "danger";
  return "attention";
};

const originForWeather = (source) => {
  if (!source) return "OBSERVADO";
  return source.toLowerCase().includes("nasa") ? "OBSERVADO" : "PREVISÃO";
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    farms,
    activeFarm,
    loading: farmsLoading,
    error: farmsError,
    refresh: refreshFarms,
  } = useFarm();
  const [dashboard, setDashboard] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [weather, setWeather] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const farmId = activeFarm?.id;
  const farmIdRef = useRef(farmId);
  const hasCoordinates =
    activeFarm?.latitude !== null &&
    activeFarm?.latitude !== undefined &&
    activeFarm?.longitude !== null &&
    activeFarm?.longitude !== undefined;

  const load = useCallback(async () => {
    const requestFarm = farmId;
    farmIdRef.current = requestFarm;
    setError("");
    setNotice("");
    setDataLoading(true);
    setAnalysis(null);
    setWeather(null);

    // Dashboard totals are independent and quick; fetch in the background.
    api.getDashboard().then(setDashboard).catch(() => null);

    if (!requestFarm) {
      setAnalysisLoading(false);
      setDataLoading(false);
      return;
    }
    if (!hasCoordinates) {
      setAnalysisLoading(false);
      setDataLoading(false);
      setNotice(
        "Esta exploração ainda não tem coordenadas. Adicione a localização para calcular análise, chuva e previsão.",
      );
      return;
    }

    setAnalysisLoading(true);
    const isCurrent = () => farmIdRef.current === requestFarm;

    const weatherPromise = api
      .getFarmWeather(requestFarm)
      .then((data) => {
        if (isCurrent()) setWeather(data);
      })
      .catch((err) => {
        if (isCurrent()) {
          setNotice((prev) => prev || err.message || "Meteorologia indisponível.");
        }
      });

    const analysisPromise = api
      .getFarmAnalysis(requestFarm)
      .then((data) => {
        if (isCurrent()) setAnalysis(data);
      })
      .catch((err) => {
        if (isCurrent()) {
          setNotice((prev) => prev || err.message || "Análise indisponível.");
        }
      })
      .finally(() => {
        if (isCurrent()) setAnalysisLoading(false);
      });

    // Render the page as soon as weather arrives; the heavier analysis
    // (NASA + SoilGrids) continues in the background.
    await weatherPromise;
    if (isCurrent()) setDataLoading(false);
    await analysisPromise;
  }, [farmId, hasCoordinates]);

  useEffect(() => {
    load();
  }, [load]);

  const metrics = useMemo(() => {
    const tempFactor = findFactor(analysis, "temperature_c");
    const rainFactor = findFactor(analysis, "rainfall_mm_7d");
    const forecastFactor = findFactor(analysis, "forecast_rain_mm");
    const phFactor = findFactor(analysis, "soil_ph");
    const forecastRain = weather?.forecast?.length
      ? sumForecastRain(weather.forecast)
      : forecastFactor?.value;

    return [
      {
        title: "Temperatura atual",
        value:
          weather?.current?.temperature_c ??
          tempFactor?.value ??
          null,
        unit: "°C",
        subtitle: tempFactor?.message || "Sem leitura disponível.",
        status: metricStatus(tempFactor),
        origin: originForWeather(weather?.source),
        icon: Activity,
      },
      {
        title: "Chuva dos últimos 7 dias",
        value: weather?.rainfall_mm_7d ?? rainFactor?.value ?? null,
        unit: "mm",
        subtitle: rainFactor?.message || "Sem leitura disponível.",
        status: metricStatus(rainFactor),
        origin: "OBSERVADO",
        icon: CloudRain,
      },
      {
        title: "Chuva prevista",
        value: forecastRain ?? null,
        unit: "mm",
        subtitle: forecastFactor?.message || "Sem previsão disponível.",
        status: metricStatus(forecastFactor),
        origin: "PREVISAO",
        icon: CloudRain,
      },
      {
        title: "pH do solo (0-5 cm)",
        value: analysis?.soil?.ph ?? phFactor?.value ?? null,
        unit: "",
        subtitle: phFactor?.message || "Estimativa SoilGrids indisponível.",
        status: metricStatus(phFactor),
        origin: "ESTIMADO",
        icon: Droplets,
      },
    ];
  }, [analysis, weather]);

  const header = (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <FarmSelector />
        {dashboard && (
          <span className="text-sm text-[var(--color-text-secondary)]">
            {dashboard.farm_count} exploração(ões) ·{" "}
            {formatNumber(dashboard.total_area_ha)} ha no total
          </span>
        )}
      </div>
      <Link
        to="/onboarding"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:border-[var(--color-fresh-green)]/40"
      >
        <Plus size={16} />
        Nova exploração
      </Link>
    </div>
  );

  if (farmsLoading && !farms.length) {
    return (
      <AppLayout>
        <LoadingState label="A carregar as suas explorações..." />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState message={error} onRetry={load} />
      </AppLayout>
    );
  }

  if (!farms.length) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={Sprout}
            title="Ainda não tem explorações"
            description="Crie a primeira exploração para receber análise de culturas, chuva e previsão com dados reais."
            actionLabel="Criar exploração"
            onAction={() => navigate("/onboarding")}
          />
        </div>
        {farmsError && (
          <div className="mt-4">
            <ErrorState message={farmsError} onRetry={refreshFarms} />
          </div>
        )}
      </AppLayout>
    );
  }

  const crop = cropLabel(activeFarm?.crop);
  const area = activeFarm?.area_ha
    ? `${formatNumber(activeFarm.area_ha)} ha`
    : "Área não indicada";
  const alertTitle =
    analysisLoading && !analysis
      ? "A calcular análise..."
      : analysis?.status === "risk"
        ? "Condições de risco"
        : analysis?.status === "attention"
          ? "Atenção às condições atuais"
          : analysis
            ? "Condições favoráveis"
            : "Análise indisponível";
  const alertDescription =
    analysisLoading && !analysis
      ? "Os dados meteorológicos aparecem primeiro; a análise de solo e NASA continua em segundo plano."
      : analysis?.recommendations?.[0] ||
        analysis?.factors?.find((factor) => factor.status !== "good")?.message ||
        notice ||
        "Sem análise para esta exploração.";

  return (
    <AppLayout>
      <DashboardHeader
        userName={user?.full_name || user?.email?.split("@")[0] || "Produtor"}
        farmName={activeFarm?.name || "Sem exploração"}
      />
      {header}

      {dataLoading && (
        <p className="mb-4 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" />
          A carregar temperatura, chuva e previsão...
        </p>
      )}

      <FarmHero
        farmName={activeFarm?.name || "Exploração"}
        crops={activeFarm?.crop ? [crop] : []}
        area={area}
      />

      {notice && (
        <p className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
          {notice}
        </p>
      )}

      <section className="mb-10">
        <SectionHeader
          title="Resumo inteligente"
          subtitle="Alertas e recomendações com base nos dados disponíveis"
        />
        <AgriculturalAlert
          severity={statusSeverity(analysis?.status)}
          title={alertTitle}
          description={alertDescription}
          timestamp={
            weather?.source
              ? `Fonte meteorológica: ${weather.source}`
              : "Análise AgroSpace"
          }
          confidence={analysis?.confidence || "Sem dados"}
          actionLabel={analysis ? "Ver explicação" : undefined}
          onAction={() => navigate("/interpretacao")}
        />
      </section>

      <section className="mb-10">
        <SectionHeader
          title="Inteligência ambiental"
          subtitle="Valores observados, estimados e previstos, com origem indicada"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 mb-10 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FarmOverview
            farmName={activeFarm?.name || "Exploração"}
            location={
              hasCoordinates
                ? `${formatNumber(activeFarm.latitude, 4)}, ${formatNumber(activeFarm.longitude, 4)}`
                : "Localização não definida"
            }
            latitude={hasCoordinates ? activeFarm.latitude : null}
            longitude={hasCoordinates ? activeFarm.longitude : null}
            area={area}
            crops={activeFarm?.crop ? [crop] : []}
            parcels={[]}
          />
        </div>
        <div className="space-y-6">
          <QuickActions />
        </div>
      </div>

      <EnvironmentalTrends
        loading={dataLoading}
        hasData={Boolean(weather?.forecast?.length)}
        forecast={weather?.forecast || []}
        source={weather?.source}
      />

      <p className="mt-6 text-xs text-[var(--color-text-secondary)]">
        {analysis?.disclaimer ||
          "A análise usa regras de demonstração e não substitui aconselhamento agronómico."}
      </p>
    </AppLayout>
  );
};
