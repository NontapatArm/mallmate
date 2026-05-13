"use client";
import type { ScreenId, Lang, Mall } from "@/lib/types";
import type { Translations } from "@/lib/i18n";
import { useLiff } from "@/context/LiffContext";

interface Props {
  t: Translations;
  lang: Lang;
  active: ScreenId;
  go: (id: ScreenId, state?: { mall: Mall } | null) => void;
  lastMall: Mall | null;
}

const TABS: { id: ScreenId; navigateTo: ScreenId; icon: string; labelKey: keyof Translations["tabs"] }[] = [
  { id: "home",         navigateTo: "home",         icon: "🏠", labelKey: "home"    },
  { id: "mall-detail",  navigateTo: "home",         icon: "🗺️", labelKey: "map"     },
  { id: "reserved",     navigateTo: "reserved",     icon: "⏰", labelKey: "queues"  },
  { id: "parking",      navigateTo: "parking",      icon: "🚗", labelKey: "parking" },
  { id: "profile-view", navigateTo: "profile-view", icon: "👤", labelKey: "profile" },
];

export default function BottomNav({ t, active, go, lastMall }: Props) {
  const { profile } = useLiff();

  const isActive = (id: ScreenId) =>
    id === active ||
    (id === "mall-detail"  && (active === "reserve" || active === "mall-detail")) ||
    (id === "reserved"     && active === "reserved") ||
    (id === "parking"      && active === "parked") ||
    (id === "profile-view" && (active === "profile-view" || active === "settings" || active === "report"));

  return (
    <nav className="bottomNav">
      {TABS.map(tab => {
        const active_ = isActive(tab.id);
        const isProfile = tab.id === "profile-view";
        return (
          <button
            key={tab.labelKey}
            className={`bottomTab ${active_ ? "bottomTabActive" : ""}`}
            onClick={() => {
              if ((tab.id === "mall-detail" || tab.id === "parking") && lastMall) {
                go(tab.id === "mall-detail" ? "mall-detail" : "parking", { mall: lastMall });
              } else {
                go(tab.navigateTo);
              }
            }}
          >
            {isProfile && profile?.pictureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.pictureUrl}
                alt=""
                width={24} height={24}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: active_ ? "2px solid var(--red)" : "2px solid transparent",
                }}
              />
            ) : (
              <span className="bottomTabIcon">{tab.icon}</span>
            )}
            <span className="bottomTabLabel">{t.tabs[tab.labelKey]}</span>
          </button>
        );
      })}
    </nav>
  );
}
