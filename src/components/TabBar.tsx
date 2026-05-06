"use client";
import type { ScreenId } from "@/lib/types";
import type { Translations } from "@/lib/i18n";

interface Props {
  active: "home" | "map" | "queues" | "parking" | "profile";
  t: Translations;
  go: (id: ScreenId) => void;
}

const TABS = [
  { id: "home" as ScreenId,         key: "home"    as const, icon: "🏠" },
  { id: "mall-detail" as ScreenId,  key: "map"     as const, icon: "🗺️" },
  { id: "reserved" as ScreenId,     key: "queues"  as const, icon: "⏰" },
  { id: "parking" as ScreenId,      key: "parking" as const, icon: "🚗" },
  { id: "profile-view" as ScreenId, key: "profile" as const, icon: "👤" },
];

export default function TabBar({ active, t, go }: Props) {
  return (
    <div className="tabBar">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`tabItem ${active === tab.key ? "tabItemActive" : ""}`}
          onClick={() => go(tab.id)}
        >
          <span className="tabIcon">{tab.icon}</span>
          <span className="tabLabel">{t.tabs[tab.key]}</span>
        </button>
      ))}
    </div>
  );
}
