"use client";
import { useEffect, useState } from "react";
import type { Lang, ScreenId, NavState } from "@/lib/types";
import { LANG } from "@/lib/i18n";
import { useLiff } from "@/context/LiffContext";
import Navbar from "./Navbar";

import WelcomeScreen      from "./screens/WelcomeScreen";
import PhoneScreen        from "./screens/PhoneScreen";
import PhoneLoadingScreen from "./screens/PhoneLoadingScreen";
import CodeScreen         from "./screens/CodeScreen";
import ProfileScreen      from "./screens/ProfileScreen";
import LocationScreen     from "./screens/LocationScreen";
import HomeScreen         from "./screens/HomeScreen";
import MallDetailScreen   from "./screens/MallDetailScreen";
import ReserveScreen      from "./screens/ReserveScreen";
import ReservedScreen     from "./screens/ReservedScreen";
import ParkingScreen      from "./screens/ParkingScreen";
import ParkedScreen       from "./screens/ParkedScreen";
import ProfileViewScreen  from "./screens/ProfileViewScreen";
import SettingsScreen     from "./screens/SettingsScreen";

type ScreenComponent = React.ComponentType<Parameters<typeof WelcomeScreen>[0]>;

const SCREENS: Record<ScreenId, ScreenComponent> = {
  "welcome":       WelcomeScreen,
  "phone":         PhoneScreen,
  "phone-loading": PhoneLoadingScreen,
  "code":          CodeScreen,
  "profile":       ProfileScreen,
  "location":      LocationScreen,
  "home":          HomeScreen,
  "mall-detail":   MallDetailScreen,
  "reserve":       ReserveScreen,
  "reserved":      ReservedScreen,
  "parking":       ParkingScreen,
  "parked":        ParkedScreen,
  "profile-view":  ProfileViewScreen,
  "settings":      SettingsScreen,
};

const AUTH_SCREENS: ScreenId[] = ["welcome", "phone", "phone-loading", "code", "profile", "location"];

export default function MallMateApp() {
  const [lang,     setLang]     = useState<Lang>("th");
  const [screenId, setScreenId] = useState<ScreenId>("welcome");
  const [navState, setNavState] = useState<NavState | null>(null);
  const [animKey,  setAnimKey]  = useState(0);

  const { ready, loggedIn } = useLiff();

  // Auto-skip auth when LIFF is already logged in
  useEffect(() => {
    if (ready && loggedIn && AUTH_SCREENS.includes(screenId)) {
      setScreenId("home");
    }
  }, [ready, loggedIn]);

  const t      = LANG[lang];
  const Screen = SCREENS[screenId];
  const showNav = !AUTH_SCREENS.includes(screenId);

  function go(id: ScreenId, state: NavState | null = null, _isBack = false) {
    setAnimKey(k => k + 1);
    setScreenId(id);
    setNavState(state);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Show loading spinner while LIFF initializes
  if (!ready && typeof window !== "undefined") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading MallMate…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pageWrapper">
      {showNav && (
        <Navbar t={t} lang={lang} setLang={setLang} active={screenId} go={go} />
      )}
      <div key={animKey} className="pageFadeIn" style={{ flex: 1 }}>
        <Screen t={t} lang={lang} setLang={setLang} go={go} state={navState} />
      </div>
    </div>
  );
}
