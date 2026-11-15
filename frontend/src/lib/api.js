const rawBase = import.meta.env.VITE_API_URL || "";
const BASE_URL = rawBase.replace(/\/$/, "");

const ACCESS_KEY = "agrospace_access_token";
const REFRESH_KEY = "agrospace_refresh_token";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);

export const setTokens = ({ access_token, refresh_token }) => {
  if (access_token) localStorage.setItem(ACCESS_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("agrospace_token");
  localStorage.removeItem("agrospace_email");
};

const notifyUnauthorized = () => {
  window.dispatchEvent(new Event("agrospace:unauthorized"));
};

const parseBody = async (res) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
};

const buildError = (res, payload) => {
  const detail =
    payload?.detail ||
    payload?.message ||
    (Array.isArray(payload?.errors) && payload.errors[0]?.message) ||
    `Pedido falhou (${res.status})`;
  if (res.status === 502 || res.status === 503 || res.status === 504) {
    return new ApiError(
      "O servidor está indisponível ou a acordar. Tente novamente em alguns segundos.",
      res.status,
      payload,
    );
  }
  return new ApiError(detail, res.status, payload);
};

const CACHE_PREFIX = "agrospace_cache:";
const CACHE_TTL = {
  dashboard: 2 * 60 * 1000,
  farms: 60 * 1000,
  profile: 10 * 60 * 1000,
  weather: 30 * 60 * 1000,
  analysis: 60 * 60 * 1000,
  soil: 6 * 60 * 60 * 1000,
  nasa: 6 * 60 * 60 * 1000,
};

const readCache = (path) => {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${path}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.savedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (path, data) => {
  try {
    localStorage.setItem(
      `${CACHE_PREFIX}${path}`,
      JSON.stringify({ savedAt: Date.now(), data }),
    );
  } catch {
    // Cache is best-effort; ignore quota/private-mode errors.
  }
};

let cacheGeneration = 0;
const pendingRequests = new Map();

export const clearApiCache = () => {
  cacheGeneration += 1;
  pendingRequests.clear();
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
};

const isServerProblem = (status) =>
  status === 0 || status === 502 || status === 503 || status === 504;

const cachedRequest = async (path, options, ttl) => {
  const hit = readCache(path);
  if (hit && Date.now() - hit.savedAt < ttl) return hit.data;

  // Collapse duplicate calls (e.g. Dashboard + Culturas asking for the same
  // analysis at the same time) into a single backend request.
  if (pendingRequests.has(path)) return pendingRequests.get(path);

  const generation = cacheGeneration;
  const pending = (async () => {
    try {
      const data = await request(path, options);
      if (generation === cacheGeneration) writeCache(path, data);
      return data;
    } catch (err) {
      // If the server is waking up but we already have data, show the last copy
      // instead of a blank page. The next visit refreshes it.
      if (hit && isServerProblem(err?.status)) return hit.data;
      throw err;
    }
  })();

  pendingRequests.set(path, pending);
  try {
    return await pending;
  } finally {
    if (pendingRequests.get(path) === pending) pendingRequests.delete(path);
  }
};

let refreshPromise = null;

const refreshTokens = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!res.ok) return false;
        const data = await parseBody(res);
        if (!data?.access_token) return false;
        setTokens(data);
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

const request = async (path, options = {}) => {
  const {
    method = "GET",
    body,
    auth = true,
    retry = true,
    timeout = 45000,
  } = options;
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new ApiError(
        "O servidor demorou demasiado a responder. Tente novamente.",
        0,
        null,
      );
    }
    throw new ApiError("Sem ligação ao servidor. Verifique a rede.", 0, null);
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401 && auth) {
    const refreshed = retry ? await refreshTokens() : false;
    if (refreshed) {
      return request(path, { ...options, retry: false });
    }
    clearTokens();
    notifyUnauthorized();
  }

  const payload = await parseBody(res);
  if (!res.ok) throw buildError(res, payload);
  return payload;
};

export const api = {
  signup: (data) =>
    request("/api/auth/signup", {
      method: "POST",
      body: data,
      auth: false,
      timeout: 60000,
    }),
  login: (data) =>
    request("/api/auth/login", {
      method: "POST",
      body: data,
      auth: false,
      timeout: 60000,
    }),
  me: () => request("/api/auth/me", { timeout: 60000 }),
  getProfile: () =>
    cachedRequest("/api/profile", { timeout: 30000 }, CACHE_TTL.profile),
  updateProfile: async (data) => {
    const result = await request("/api/profile", { method: "PUT", body: data });
    clearApiCache();
    return result;
  },
  listFarms: () => cachedRequest("/api/farms", {}, CACHE_TTL.farms),
  createFarm: async (data) => {
    const result = await request("/api/farms", { method: "POST", body: data });
    clearApiCache();
    return result;
  },
  getFarm: (id) =>
    cachedRequest(`/api/farms/${id}`, {}, CACHE_TTL.farms),
  updateFarm: async (id, data) => {
    const result = await request(`/api/farms/${id}`, { method: "PUT", body: data });
    clearApiCache();
    return result;
  },
  deleteFarm: async (id) => {
    const result = await request(`/api/farms/${id}`, { method: "DELETE" });
    clearApiCache();
    return result;
  },
  getDashboard: () =>
    cachedRequest("/api/dashboard", { timeout: 30000 }, CACHE_TTL.dashboard),
  getFarmWeather: (id) =>
    cachedRequest(
      `/api/farms/${id}/weather`,
      { timeout: 45000 },
      CACHE_TTL.weather,
    ),
  getFarmAnalysis: (id) =>
    cachedRequest(
      `/api/farms/${id}/analysis`,
      { timeout: 90000 },
      CACHE_TTL.analysis,
    ),
  getFarmSoil: (id) =>
    cachedRequest(`/api/farms/${id}/soil`, { timeout: 60000 }, CACHE_TTL.soil),
  getFarmNasa: (id) =>
    cachedRequest(`/api/farms/${id}/nasa`, { timeout: 60000 }, CACHE_TTL.nasa),
  explainFarm: (id, data) =>
    request(`/api/farms/${id}/explain`, {
      method: "POST",
      body: data,
      timeout: 60000,
    }),
  chat: (data) => request("/api/chat", { method: "POST", body: data, timeout: 45000 }),
};

// Backwards-compatible aliases used by older components.
export const getToken = getAccessToken;
export const setToken = (token) => localStorage.setItem(ACCESS_KEY, token);
export const clearToken = clearTokens;
