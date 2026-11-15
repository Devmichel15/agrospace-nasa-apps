import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { ONBOARDING_STEPS, initialValues, isStepValid } from "../data/Onboarding.data";
import { api } from "../lib/api";
import { useFarm } from "../context/FarmContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CROP_KEYS = {
  tomate: "tomato",
  mandioca: "cassava",
  milho: "maize",
  feijao: "beans",
};

const saveFarm = async (payload) => {
  const cropValue = typeof payload.crops === "string" ? payload.crops : "";
  const farm = {
    name: String(payload.name || "").trim(),
    crop: CROP_KEYS[cropValue] || cropValue || null,
    latitude: payload.location?.lat ?? null,
    longitude: payload.location?.lng ?? null,
    area_ha: payload.areaHa,
  };
  return api.createFarm(farm);
};

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const Recenter = ({ pos }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([pos.lat, pos.lng]);
  }, [pos.lat, pos.lng, map]);
  return null;
};

const LocationPicker = ({ value, onChange }) => {
  const defaultCenter = useMemo(() => {
    if (value && typeof value.lat === "number" && typeof value.lng === "number") {
      return [value.lat, value.lng];
    }
    return [-8.8383, 13.2344];
  }, [value]);

  const [position, setPosition] = useState(
    value && typeof value.lat === "number" && typeof value.lng === "number"
      ? { lat: value.lat, lng: value.lng }
      : { lat: defaultCenter[0], lng: defaultCenter[1] }
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (value && typeof value.lat === "number" && typeof value.lng === "number") {
      setPosition({ lat: value.lat, lng: value.lng });
    }
  }, [value]);

  const handlePick = (next) => {
    setPosition(next);
    onChange(next);
    setError("");
  };

  const handleUseMyLocation = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("O seu navegador não suporta localização.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(next);
        onChange(next);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Não tem permissão para usar a localização. Clique no mapa ou mova o marcador.");
        } else {
          setError("Não foi possível obter a localização. Tente novamente ou clique no mapa.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latlng = marker.getLatLng();
          const next = { lat: latlng.lat, lng: latlng.lng };
          setPosition(next);
          onChange(next);
          setError("");
        }
      },
    }),
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleUseMyLocation}
        className="w-full border border-[#0B3D2E] text-[#0B3D2E] px-4 py-2 rounded-lg font-display"
      >
        Usar a minha localização
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <div className="w-full h-48 rounded-lg overflow-hidden border border-[#0B3D2E]/30">
        <MapContainer center={[position.lat, position.lng]} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={handlePick} />
          <Recenter pos={position} />
          <Marker draggable={true} eventHandlers={eventHandlers} position={[position.lat, position.lng]} ref={markerRef} />
        </MapContainer>
      </div>
      <p className="text-xs text-[#0B3D2E]/70">Clique no mapa ou arraste o marcador para ajustar a localização.</p>
    </div>
  );
};

const SoilModal = ({ open, onClose, value, onChange }) => {
  const [local, setLocal] = useState(value || { ph: "", texture: "", organicMatter: "" });

  useEffect(() => {
    setLocal(value || { ph: "", texture: "", organicMatter: "" });
  }, [value, open]);

  if (!open) return null;

  const handleSave = () => {
    const hasAny = Object.values(local).some((v) => v !== "" && v !== null && v !== undefined);
    if (!hasAny) {
      onChange(null);
    } else {
      onChange(local);
    }
    onClose();
  };

  const handleClear = () => {
    setLocal({ ph: "", texture: "", organicMatter: "" });
    onChange(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white w-full max-w-sm rounded-xl p-4 flex flex-col gap-3">
        <h3 className="text-lg font-display text-[#0B3D2E]">Análise de solo (opcional)</h3>
        <div className="flex flex-col gap-2">
          <label htmlFor="soil-ph">pH</label>
          <input
            id="soil-ph"
            type="text"
            value={local.ph}
            onChange={(e) => setLocal((s) => ({ ...s, ph: e.target.value }))}
            className="w-full p-2 ring rounded-lg ring-[#0B3D2E]/60"
            placeholder="Ex.: 6,5"
          />
          <label htmlFor="soil-texture">Textura</label>
          <input
            id="soil-texture"
            type="text"
            value={local.texture}
            onChange={(e) => setLocal((s) => ({ ...s, texture: e.target.value }))}
            className="w-full p-2 ring rounded-lg ring-[#0B3D2E]/60"
            placeholder="Ex.: Franco-arenoso"
          />
          <label htmlFor="soil-om">Matéria orgânica</label>
          <input
            id="soil-om"
            type="text"
            value={local.organicMatter}
            onChange={(e) => setLocal((s) => ({ ...s, organicMatter: e.target.value }))}
            className="w-full p-2 ring rounded-lg ring-[#0B3D2E]/60"
            placeholder="Ex.: 2,1%"
          />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <button type="button" onClick={handleSave} className="bg-[#0B3D2E] text-white px-4 py-2 rounded-lg font-display">
            Guardar
          </button>
          <button type="button" onClick={handleClear} className="border border-[#0B3D2E] text-[#0B3D2E] px-4 py-2 rounded-lg font-display">
            Limpar e não adicionar
          </button>
          <button type="button" onClick={onClose} className="text-[#0B3D2E]/80">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export const Onboarding = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { refresh: refreshFarms } = useFarm();
  const steps = ONBOARDING_STEPS;
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState(initialValues());
  const [soilModalOpen, setSoilModalOpen] = useState(false);
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentStep = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const canContinue = isStepValid(currentStep, values);

  const setField = (id, val) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const toggleCrop = (crop) => {
    setValues((prev) => {
      const current = Array.isArray(prev.crops) ? prev.crops : [];
      if (current.includes(crop)) {
        return { ...prev, crops: current.filter((c) => c !== crop) };
      }
      return { ...prev, crops: [...current, crop] };
    });
  };

  const handleAreaChange = (e) => {
    const raw = e.target.value;
    setField("areaHa", raw);
  };

  const parseArea = (val) => {
    if (val === null || val === undefined || val === "") return NaN;
    if (typeof val === "number") return val;
    const normalized = String(val).replace(",", ".");
    const num = Number(normalized);
    return Number.isNaN(num) ? NaN : num;
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      navigate("/dashboard");
      return;
    }
    setDir(-1);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const handleContinue = async () => {
    if (!canContinue || saving) return;
    setError("");
    if (isLast) {
      const areaNum = parseArea(values.areaHa);
      if (Number.isNaN(areaNum) || areaNum <= 0) {
        setError("Indique a área da exploração em hectares.");
        return;
      }
      if (!values.location || typeof values.location !== "object") {
        setError("Escolha a localização da exploração no mapa.");
        return;
      }
      setSaving(true);
      try {
        const payload = {
          name: values.name,
          crops: typeof values.crops === "string" ? values.crops : "",
          location: values.location,
          areaHa: areaNum,
        };
        await saveFarm(payload);
        await refreshFarms();
        navigate("/dashboard");
      } catch (err) {
        setError(err.message || "Não foi possível guardar a exploração.");
      } finally {
        setSaving(false);
      }
      return;
    }
    setDir(1);
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  };

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
  };

  const renderField = (field) => {
    if (field.type === "text") {
      return (
        <div className="flex flex-col gap-1">
          {field.label ? <label htmlFor={field.id}>{field.label}</label> : null}
          <input
            id={field.id}
            type="text"
            value={values[field.id] || ""}
            onChange={(e) => setField(field.id, e.target.value)}
            placeholder={field.placeholder || ""}
            required={field.required}
            className="w-full p-2 ring rounded-lg ring-[#0B3D2E]/70"
          />
        </div>
      );
    }

    if (field.type === "number") {
      return (
        <div className="flex flex-col gap-1">
          {field.label ? <label htmlFor={field.id}>{field.label}</label> : null}
          <div className="flex items-center gap-2">
            <input
              id={field.id}
              type="text"
              inputMode="decimal"
              value={values[field.id] ?? ""}
              onChange={handleAreaChange}
              placeholder={field.placeholder || "0,0"}
              required={field.required}
              className="flex-1 p-2 ring rounded-lg ring-[#0B3D2E]/70"
            />
            {field.unit ? <span className="text-[#0B3D2E]">{field.unit}</span> : null}
          </div>
          {field.hint ? <p className="text-xs text-[#0B3D2E]/70">{field.hint}</p> : null}
        </div>
      );
    }

    if (field.type === "multi-card") {
      const selected = Array.isArray(values[field.id]) ? values[field.id] : [];
      return (
        <div className="flex flex-col gap-2">
          {field.label ? <p className="text-[#0B3D2E]">{field.label}</p> : null}
          <div className="grid grid-cols-2 gap-2">
            {(field.options || []).map((opt) => {
              const isSel = selected.includes(opt.value);
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => toggleCrop(opt.value)}
                  aria-pressed={isSel}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border ${isSel ? "bg-[#0B3D2E] text-white border-[#0B3D2E]" : "border-[#0B3D2E]/60 text-[#0B3D2E]"}`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-sm font-display">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === "select") {
      const current = values[field.id] || "";
      return (
        <div className="flex flex-col gap-2">
          {field.label ? <p className="text-[#0B3D2E]">{field.label}</p> : null}
          <select
            id={field.id}
            value={current}
            onChange={(e) => setField(field.id, e.target.value)}
            required={field.required}
            className="w-full p-2 ring rounded-lg ring-[#0B3D2E]/70"
          >
            <option value="" disabled>{field.placeholder || "Selecione uma opção"}</option>
            {(field.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {field.hint ? <p className="text-xs text-[#0B3D2E]/70">{field.hint}</p> : null}
        </div>
      );
    }

    if (field.type === "single-chip") {
      const current = values[field.id];
      return (
        <div className="flex flex-col gap-2">
          {field.label ? <p className="text-[#0B3D2E]">{field.label}</p> : null}
          <div className="flex flex-wrap gap-2">
            {(field.options || []).map((opt) => {
              const isSel = current === opt.value;
              return (
                <button
                  type="button"
                  key={String(opt.value)}
                  onClick={() => setField(field.id, opt.value)}
                  aria-pressed={isSel}
                  className={`px-3 py-1 rounded-full border ${isSel ? "bg-[#0B3D2E] text-white border-[#0B3D2E]" : "border-[#0B3D2E]/60 text-[#0B3D2E]"}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.type === "location") {
      return (
        <div className="flex flex-col gap-2">
          <LocationPicker value={values[field.id]} onChange={(loc) => setField(field.id, loc)} />
        </div>
      );
    }

    if (field.type === "action") {
      return (
        <div className="flex flex-col gap-2">
          {field.label ? <p className="text-[#0B3D2E]">{field.label}</p> : null}
          <button
            type="button"
            onClick={() => setSoilModalOpen(true)}
            className="w-full border border-[#0B3D2E] text-[#0B3D2E] px-4 py-2 rounded-lg font-display"
          >
            {field.actionLabel || "Adicionar resultados"}
          </button>
          {field.actionHint ? <p className="text-xs text-[#0B3D2E]/70">{field.actionHint}</p> : null}
          {values.soilAnalysis ? <p className="text-xs text-[#0B3D2E]">Análise adicionada</p> : null}
        </div>
      );
    }

    return null;
  };

  return (
    <main className="w-full min-h-screen px-4 py-6 flex justify-center">
      <div className="w-full max-w-md flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <button type="button" onClick={handleBack} className="text-[#0B3D2E]">
              Voltar
            </button>
            <span className="text-sm text-[#0B3D2E]/70">
              Passo {stepIndex + 1} de {steps.length}
            </span>
          </div>
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full ${idx <= stepIndex ? "bg-[#0B3D2E]" : "bg-[#0B3D2E]/20"}`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-display text-[#0B3D2E] mt-2">{currentStep.title}</h1>
        </header>

        <section className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-4">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={stepIndex}
              custom={dir}
              variants={reduceMotion ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } } : variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduceMotion ? 0.15 : 0.25 }}
              className="flex flex-col gap-4"
            >
              {(currentStep.fields || []).map((field) => (
                <div key={field.id}>{renderField(field)}</div>
              ))}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || saving}
            className={`w-full px-4 py-2 rounded-lg font-display ${canContinue && !saving ? "bg-[#0B3D2E] text-white" : "bg-[#0B3D2E]/40 text-white cursor-not-allowed"}`}
          >
            {saving ? "A guardar..." : isLast ? "Concluir" : "Continuar"}
          </button>
        </section>
      </div>

      <SoilModal
        open={soilModalOpen}
        onClose={() => setSoilModalOpen(false)}
        value={values.soilAnalysis}
        onChange={(v) => setField("soilAnalysis", v)}
      />
    </main>
  );
};
