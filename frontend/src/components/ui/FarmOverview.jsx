import { useEffect, useState } from "react";
import { MapPin, Layers, ExternalLink } from "lucide-react";
import { MapContainer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { SectionHeader } from './SectionHeader';

const markerIcon = L.divIcon({
  className: "farm-overview-marker",
  html: `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;">
      <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(37,134,83,0.22);"></span>
      <span style="position:relative;width:16px;height:16px;border-radius:9999px;background:#258653;border:3px solid #ffffff;box-shadow:0 4px 10px rgba(16,47,36,0.35);"></span>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const TILE_LAYERS = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
  },
};

const TileLayerSwitcher = ({ layer }) => {
  const map = useMap();

  useEffect(() => {
    const { url, attribution } = TILE_LAYERS[layer];
    const tiles = L.tileLayer(url, {
      attribution,
      maxZoom: 19,
      detectRetina: true,
    });
    tiles.addTo(map);
    return () => {
      map.removeLayer(tiles);
    };
  }, [map, layer]);

  return null;
};

const MapViewController = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), { animate: true });
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, [map, latitude, longitude]);

  return null;
};

const toCoordinate = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const FarmOverview = ({ 
  farmName = "Fazenda Boa Terra",
  location,
  latitude,
  longitude,
  area,
  crops = [],
  parcels = []
}) => {
  const [layer, setLayer] = useState("street");
  const lat = toCoordinate(latitude);
  const lng = toCoordinate(longitude);
  const hasCoordinates = lat !== null && lng !== null;

  return (
    <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 pt-5">
        <SectionHeader 
          title="Visão da propriedade"
          subtitle="Localização geográfica e contexto das parcelas e culturas"
          className="mb-0"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-warm-bg)] flex items-center justify-center border border-[var(--color-border)]">
              <MapPin size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[var(--color-text-primary)]">{farmName}</h3>
              {location && <p className="text-sm text-[var(--color-text-secondary)]">{location}</p>}
            </div>
          </div>
          {area && (
            <div className="text-right">
              <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Área total</p>
              <p className="text-lg font-display font-semibold">{area}</p>
            </div>
          )}
        </div>

        {hasCoordinates ? (
          <div className="relative h-64 rounded-xl border border-[var(--color-border)] overflow-hidden mb-5">
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              scrollWheelZoom={false}
              className="h-full w-full z-0"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayerSwitcher layer={layer} />
              <MapViewController latitude={lat} longitude={lng} />
              <Marker position={[lat, lng]} icon={markerIcon} />
            </MapContainer>

            <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1 rounded-lg bg-[var(--color-surface)]/95 backdrop-blur-sm border border-[var(--color-border)] p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setLayer("satellite")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  layer === "satellite"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Satélite
              </button>
              <button
                type="button"
                onClick={() => setLayer("street")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  layer === "street"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                Mapa
              </button>
            </div>

            <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[var(--color-surface)]/95 backdrop-blur-sm border border-[var(--color-border)]">
              <Layers size={14} className="text-[var(--color-primary)]" />
              <span className="text-xs font-medium">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
              <a
                href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`}
                target="_blank"
                rel="noreferrer"
                className="ml-1 text-[var(--color-primary)] hover:text-[var(--color-fresh-green)]"
                aria-label="Abrir localização no OpenStreetMap"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ) : (
          <div className="relative h-48 rounded-xl bg-gradient-to-br from-[var(--color-lime-accent)]/15 to-[var(--color-fresh-green)]/8 border border-[var(--color-border)] overflow-hidden mb-5 flex flex-col items-center justify-center gap-2 text-center px-6">
            <div className="w-11 h-11 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
              <MapPin size={20} className="text-[var(--color-primary)]" />
            </div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">Localização não definida</p>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-xs">
              Adicione as coordenadas da exploração para ver a localização no mapa de satélite.
            </p>
          </div>
        )}

        {(crops.length > 0 || parcels.length > 0) && (
          <div className="space-y-4">
            {crops.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Culturas plantadas</p>
                <div className="flex flex-wrap gap-2">
                  {crops.map((crop, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-[var(--color-warm-bg)] text-sm text-[var(--color-text-primary)] border border-[var(--color-border)]">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {parcels.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">Parcelas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {parcels.map((parcel, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-warm-bg)] border border-[var(--color-border)]">
                      <span className="text-sm font-medium">{parcel.name}</span>
                      <span className="text-xs text-[var(--color-text-secondary)]">{parcel.area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
