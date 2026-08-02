"use client";

import { createContext, useContext, useState } from "react";

interface AuthContextValue {
  loggedOut: boolean;
  logout: () => void;
  login: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loggedOut, setLoggedOut] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        loggedOut,
        logout: () => setLoggedOut(true),
        login: () => setLoggedOut(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
