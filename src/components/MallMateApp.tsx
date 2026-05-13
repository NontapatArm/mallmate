"use client";
import { useEffect, useState } from "react";
import type { Lang, ScreenId, NavState, Mall } from "@/lib/types";
import { LANG } from "@/lib/i18n";
import { useLiff } from "@/context/LiffContext";
import { ensureAnonSession, fetchMalls } from "@/lib/supabase";
import Navbar    from "./Navbar";
import BottomNav from "./BottomNav";

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
import ReportScreen       from "./screens/ReportScreen";

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
  "report":        ReportScreen,
};

const AUTH_SCREENS: ScreenId[] = ["welcome", "phone", "phone-loading", "code", "profile", "location"];

export default function MallMateApp() {
  const [lang,     setLang]     = useState<Lang>("th");
  const [screenId, setScreenId] = useState<ScreenId>("welcome");
  const [navState, setNavState] = useState<NavState | null>(null);
  const [animKey,  setAnimKey]  = useState(0);
  const [lastMall, setLastMall] = useState<Mall | null>(null);

  const { ready, loggedIn } = useLiff();

  // Auto-skip auth when LIFF is already logged in — runs after hydration only
  useEffect(() => {
    if (ready && loggedIn && AUTH_SCREENS.includes(screenId)) {
      setScreenId("home");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, loggedIn]);

  // Ensure every visitor has a Supabase session — call once on mount, then again on any app screen
  useEffect(() => {
    ensureAnonSession().catch(() => {});
    // Set default mall to MBK Center (first mall from Supabase)
    fetchMalls().then(malls => {
      if (malls.length > 0) {
        const mbk = malls.find(m => m.name.toLowerCase().includes("mbk")) ?? malls[0];
        setLastMall(mbk);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!AUTH_SCREENS.includes(screenId)) {
      ensureAnonSession().catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId]);

  const t       = LANG[lang];
  const Screen  = SCREENS[screenId];
  const showNav = !AUTH_SCREENS.includes(screenId);

  function go(id: ScreenId, state: NavState | null = null, _isBack = false) {
    setAnimKey(k => k + 1);
    setScreenId(id);
    setNavState(state);
    if (state?.mall) setLastMall(state.mall);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pageWrapper">
      {showNav && (
        <Navbar t={t} lang={lang} setLang={setLang} active={screenId} go={go} lastMall={lastMall} />
      )}
      <div key={animKey} className="pageFadeIn" style={{ flex: 1 }}>
        <Screen t={t} lang={lang} setLang={setLang} go={go} state={navState} />
      </div>
      {showNav && (
        <BottomNav t={t} lang={lang} active={screenId} go={go} lastMall={lastMall} />
      )}
    </div>
  );
}
