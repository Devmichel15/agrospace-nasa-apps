import { MapPin } from "lucide-react";
import { useFarm } from "../../context/FarmContext";

export const FarmSelector = ({ className = "" }) => {
  const { farms, activeFarmId, setActiveFarmId } = useFarm();

  if (farms.length === 0) return null;

  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
        <MapPin size={14} />
        Exploração
      </span>
      <select
        value={activeFarmId || ""}
        onChange={(event) => setActiveFarmId(event.target.value)}
        className="min-w-40 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
      >
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.name}
          </option>
        ))}
      </select>
    </label>
  );
};
