"use client";
import { useState } from "react";
import type { Lang, ScreenId, NavState } from "@/lib/types";
import { LANG } from "@/lib/i18n";

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

const SCREENS: Record<ScreenId, React.ComponentType<Parameters<typeof WelcomeScreen>[0]>> = {
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

export default function MallMateApp() {
  const [lang,     setLang]     = useState<Lang>("th");
  const [screenId, setScreenId] = useState<ScreenId>("welcome");
  const [navState, setNavState] = useState<NavState | null>(null);
  const [animKey,  setAnimKey]  = useState(0);
  const [animCls,  setAnimCls]  = useState("slideIn");

  const t = LANG[lang];

  function go(id: ScreenId, state: NavState | null = null, isBack = false) {
    setAnimCls(isBack ? "slideInBack" : "slideIn");
    setAnimKey(k => k + 1);
    setScreenId(id);
    setNavState(state);
  }

  const Screen = SCREENS[screenId];

  return (
    <div className="appRoot">
      <div className="phoneShell">
        <div className="screenWrap">
          <div key={animKey} className={animCls} style={{ position: "absolute", inset: 0 }}>
            <Screen
              t={t}
              lang={lang}
              setLang={setLang}
              go={go}
              state={navState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
