export const CROP_LABELS = {
  milho: "Milho",
  maize: "Milho",
  tomate: "Tomate",
  tomato: "Tomate",
  feijao: "Feijão",
  beans: "Feijão",
  mandioca: "Mandioca",
  cassava: "Mandioca",
  batata: "Batata",
  cebola: "Cebola",
};

export const cropLabel = (crop) => {
  if (!crop) return "Sem cultura";
  return CROP_LABELS[String(crop).toLowerCase()] || crop;
};

export const STATUS_LABELS = {
  favorable: "Favorável",
  attention: "Atenção",
  risk: "Risco",
};

export const statusLabel = (status) => STATUS_LABELS[status] || status || "Sem dados";

export const statusSeverity = (status) => {
  if (status === "risk") return "danger";
  if (status === "attention") return "attention";
  if (status === "favorable") return "success";
  return "info";
};

export const statusBadge = (status) => {
  if (status === "risk") {
    return "bg-[rgba(217,91,80,0.12)] text-[var(--color-danger)]";
  }
  if (status === "attention") {
    return "bg-[rgba(233,162,59,0.16)] text-[var(--color-warning)]";
  }
  if (status === "favorable") {
    return "bg-[rgba(37,134,83,0.12)] text-[var(--color-success)]";
  }
  return "bg-[rgba(116,128,120,0.12)] text-[var(--color-text-secondary)]";
};

export const FACTOR_LABELS = {
  temperature_c: "Temperatura atual",
  rainfall_mm_7d: "Chuva dos últimos 7 dias",
  forecast_max_temp_c: "Temperatura máxima prevista",
  forecast_rain_mm: "Chuva prevista",
  soil_ph: "pH do solo",
  soil_wetness_nasa: "Humidade do solo (NASA)",
};

export const factorLabel = (name) => FACTOR_LABELS[name] || name;

export const factorUnit = (name) => {
  if (name === "temperature_c" || name === "forecast_max_temp_c") return "°C";
  if (name === "rainfall_mm_7d" || name === "forecast_rain_mm") return "mm";
  return "";
};

export const formatNumber = (value, digits = 1) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return Number(value).toFixed(digits).replace(/\.0$/, "");
};

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
};

export const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const sumForecastRain = (forecast = []) =>
  Math.round(
    forecast.reduce((total, day) => total + Number(day.rain_mm || 0), 0) * 10,
  ) / 10;

export const findFactor = (analysis, name) =>
  (analysis?.factors || []).find((factor) => factor.name === name) || null;

const isoDay = (date) => date.toISOString().slice(0, 10);

const addDays = (base, days) => {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next;
};

export const buildCalendarEvents = (analysis, weather, farm) => {
  if (!analysis) return [];
  const crop = cropLabel(farm?.crop);
  const today = new Date();
  const forecast = weather?.forecast || [];
  const forecastRain = sumForecastRain(forecast);
  const rainfall = findFactor(analysis, "rainfall_mm_7d");
  const rainForecast = findFactor(analysis, "forecast_rain_mm");
  const soilPh = findFactor(analysis, "soil_ph");
  const wetness = findFactor(analysis, "soil_wetness_nasa");
  const sources = [
    weather?.source || "Open-Meteo",
    analysis?.soil ? "SoilGrids" : null,
    analysis?.nasa ? "NASA POWER" : null,
  ].filter(Boolean);
  const events = [];

  const add = (type, title, start, end, risk, reason, eventSources = sources) => {
    events.push({
      id: `evt_${events.length + 1}`,
      type,
      crop,
      title,
      start: isoDay(start),
      end: isoDay(end),
      risk,
      reason,
      sources: eventSources,
    });
  };

  if (analysis.status === "risk") {
    add(
      "care",
      `Verificar condições de ${crop}`,
      today,
      addDays(today, 1),
      "high",
      analysis.recommendations?.[0] || "Existem fatores de risco ativos.",
    );
  } else if (forecastRain >= 20 || rainForecast?.status === "warning") {
    add(
      "care",
      "Proteger culturas e verificar drenagem",
      addDays(today, 1),
      addDays(today, 3),
      "medium",
      `Está prevista chuva significativa (${formatNumber(forecastRain)} mm) nos próximos dias.`,
    );
  } else if (rainfall && rainfall.status !== "good") {
    add(
      "care",
      `Planear rega de ${crop}`,
      today,
      addDays(today, 2),
      rainfall.status === "risk" ? "high" : "medium",
      rainfall.message,
    );
  } else {
    add(
      "plant",
      `Janela indicativa para plantar ${crop}`,
      addDays(today, 2),
      addDays(today, 9),
      "low",
      "Condições atuais dentro dos intervalos definidos para a cultura.",
    );
  }

  if (soilPh?.status === "warning") {
    add(
      "care",
      "Avaliar correção do pH do solo",
      addDays(today, 5),
      addDays(today, 12),
      "medium",
      soilPh.message,
    );
  }
  if (wetness?.status === "warning") {
    add(
      "care",
      "Acompanhar humidade do solo",
      addDays(today, 2),
      addDays(today, 6),
      "medium",
      wetness.message,
    );
  }

  return events;
};

export const buildReport = (analysis, weather, farm) => {
  if (!analysis) return null;
  const today = new Date();
  const forecast = weather?.forecast || [];
  return {
    periodFrom: isoDay(addDays(today, -6)),
    periodTo: isoDay(today),
    status: analysis.status,
    summary:
      analysis.recommendations?.[0] ||
      "Condições dentro dos intervalos definidos para a cultura.",
    rainfall: weather?.rainfall_mm_7d,
    temperature: weather?.current?.temperature_c,
    humidity: weather?.current?.humidity_pct,
    forecastRain: sumForecastRain(forecast),
    soilPh: analysis.soil?.ph,
    factors: analysis.factors || [],
    recommendations: analysis.recommendations || [],
    limitations: analysis.limitations || [],
    sources: analysis.data_sources || [],
    disclaimer: analysis.disclaimer,
    crop: cropLabel(farm?.crop),
  };
};

export const buildAlerts = (analysis) => {
  if (!analysis) return [];
  const severity = { risk: "danger", warning: "attention", good: "ok" };
  return (analysis.factors || [])
    .filter((factor) => factor.status !== "good")
    .map((factor, index) => ({
      id: `alt_${index + 1}`,
      severity: severity[factor.status] || "attention",
      type: factor.name,
      title: factorLabel(factor.name),
      message: factor.message,
      value: factor.value,
      unit: factorUnit(factor.name),
    }));
};
