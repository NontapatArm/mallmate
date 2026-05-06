"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { LineProfile } from "@/lib/liff";

interface LiffState {
  ready:      boolean;
  loggedIn:   boolean;
  inLineApp:  boolean;
  profile:    LineProfile | null;
  login:      () => void;
  logout:     () => void;
}

const LiffContext = createContext<LiffState>({
  ready: false, loggedIn: false, inLineApp: false, profile: null,
  login: () => {}, logout: () => {},
});

export function useLiff() { return useContext(LiffContext); }

export function LiffProvider({ children }: { children: React.ReactNode }) {
  const [ready,     setReady]     = useState(false);
  const [loggedIn,  setLoggedIn]  = useState(false);
  const [inLineApp, setInLineApp] = useState(false);
  const [profile,   setProfile]   = useState<LineProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { initLiff, isInLineApp: checkInLine, getLineProfile } = await import("@/lib/liff");
        const inLine = checkInLine();
        setInLineApp(inLine);

        await initLiff();

        if (cancelled) return;

        const { isLoggedIn } = await import("@/lib/liff");
        const loggedInNow = await isLoggedIn();
        setLoggedIn(loggedInNow);

        if (loggedInNow) {
          const p = await getLineProfile();
          if (!cancelled) setProfile(p);
        }
      } catch (err) {
        console.warn("LIFF init failed:", err);
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function login() {
    const { login: liffLogin } = await import("@/lib/liff");
    await liffLogin();
  }

  async function logout() {
    const { logout: liffLogout } = await import("@/lib/liff");
    await liffLogout();
    setLoggedIn(false);
    setProfile(null);
  }

  return (
    <LiffContext.Provider value={{ ready, loggedIn, inLineApp, profile, login, logout }}>
      {children}
    </LiffContext.Provider>
  );
}
