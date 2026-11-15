import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const FarmContext = createContext(null);
const ACTIVE_KEY = "agrospace_active_farm";

export const FarmProvider = ({ children }) => {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [activeFarmId, setActiveFarmIdState] = useState(
    () => localStorage.getItem(ACTIVE_KEY) || null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setActiveFarmId = useCallback((id) => {
    setActiveFarmIdState(id || null);
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      setFarms([]);
      return [];
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.listFarms();
      setFarms(data);
      const stored = activeFarmId || localStorage.getItem(ACTIVE_KEY);
      const selected = data.find((farm) => farm.id === stored) || data[0];
      if (selected && selected.id !== activeFarmId) {
        setActiveFarmId(selected.id);
      }
      if (!selected && activeFarmId) {
        setActiveFarmId(null);
      }
      return data;
    } catch (err) {
      setError(err.message || "Não foi possível carregar as explorações.");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user, activeFarmId, setActiveFarmId]);

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setFarms([]);
      setError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const activeFarm = useMemo(
    () => farms.find((farm) => farm.id === activeFarmId) || farms[0] || null,
    [farms, activeFarmId],
  );

  const value = {
    farms,
    activeFarm,
    activeFarmId: activeFarm?.id || null,
    setActiveFarmId,
    refresh,
    loading,
    error,
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};

export const useFarm = () => {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error("useFarm must be used within FarmProvider");
  return ctx;
};
