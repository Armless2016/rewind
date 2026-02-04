import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
  token: string | null;
  isAuth: boolean;
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readToken(): string | null {
  // спочатку session, потім local
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => readToken());

  // на випадок якщо токен змінюється між вкладками
  useEffect(() => {
    const onStorage = () => setToken(readToken());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (newToken: string, remember: boolean = true) => {
    setToken(newToken);

    // чистимо обидва, щоб не було конфліктів
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");

    if (remember) localStorage.setItem("token", newToken);
    else sessionStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuth: !!token,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
