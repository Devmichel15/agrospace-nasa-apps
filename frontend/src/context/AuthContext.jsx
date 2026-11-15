import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  api,
  clearApiCache,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../lib/api";

const AuthContext = createContext(null);
const USER_KEY = "agrospace_user";

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCachedUser = (user) => {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch {
    // localStorage can be unavailable (private mode); session still works in memory.
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const loadUser = useCallback(async () => {
    const [me, profile] = await Promise.all([
      api.me(),
      api.getProfile().catch(() => null),
    ]);
    return {
      ...me,
      full_name: profile?.full_name || me?.full_name || null,
    };
  }, []);

  const saveUser = useCallback((nextUser) => {
    setUser(nextUser);
    writeCachedUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    clearApiCache();
    writeCachedUser(null);
    setUser(null);
  }, []);

  useEffect(() => {
    mounted.current = true;
    const bootstrap = async () => {
      if (!getAccessToken() && !getRefreshToken()) {
        writeCachedUser(null);
        if (mounted.current) setLoading(false);
        return;
      }

      // Keep the last known user visible while the token is validated. This
      // avoids a logout screen when the backend is cold-starting or briefly
      // unreachable (502/503/timeout).
      const cached = readCachedUser();
      if (cached && mounted.current) {
        setUser(cached);
        // Show the app immediately with the cached profile; validation
        // continues in the background.
        setLoading(false);
      }

      try {
        const nextUser = await loadUser();
        if (mounted.current) saveUser(nextUser);
      } catch (err) {
        const status = err?.status;
        if (status === 401 || status === 403) {
          if (mounted.current) clearSession();
        } else if (!cached) {
          // Server/network problem and no cached profile: stay logged out,
          // but keep the tokens so a retry can succeed once the server is up.
          if (mounted.current) setUser(null);
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    };
    bootstrap();

    const onUnauthorized = () => {
      clearSession();
    };
    window.addEventListener("agrospace:unauthorized", onUnauthorized);
    return () => {
      mounted.current = false;
      window.removeEventListener("agrospace:unauthorized", onUnauthorized);
    };
  }, [loadUser, saveUser, clearSession]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    clearApiCache();
    setTokens(data);
    const nextUser = await loadUser();
    saveUser(nextUser);
    return nextUser;
  };

  const signup = async (email, password, full_name) => {
    await api.signup({ email, password, full_name });
    try {
      return await login(email, password);
    } catch (err) {
      const confirmation = new Error(
        "Conta criada. Confirme o email antes de entrar ou tente iniciar sessão.",
      );
      confirmation.code = "email_confirmation";
      confirmation.cause = err;
      throw confirmation;
    }
  };

  const logout = () => {
    clearSession();
  };

  const updateProfile = async (full_name) => {
    const data = await api.updateProfile({ full_name });
    const nextUser = {
      ...(user || readCachedUser() || {}),
      ...data,
      full_name: data?.full_name ?? full_name,
    };
    saveUser(nextUser);
    return data;
  };

  const refreshUser = async () => {
    const nextUser = await loadUser();
    saveUser(nextUser);
    return nextUser;
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
