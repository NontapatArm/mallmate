"use client";
import type { ScreenId, Lang } from "@/lib/types";
import type { Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
  lang: Lang;
  setLang: (l: Lang) => void;
  active: ScreenId;
  go: (id: ScreenId) => void;
}

const NAV_ITEMS = [
  { id: "home"        as ScreenId, icon: "🏠", labelKey: "home"    as const },
  { id: "mall-detail" as ScreenId, icon: "🗺️", labelKey: "map"     as const },
  { id: "reserved"    as ScreenId, icon: "⏰", labelKey: "queues"  as const },
  { id: "parking"     as ScreenId, icon: "🚗", labelKey: "parking" as const },
];

export default function Navbar({ t, lang, setLang, active, go }: Props) {
  const isActive = (id: ScreenId) =>
    id === active ||
    (id === "home" && (active === "welcome" || active === "location")) ||
    (id === "mall-detail" && active === "reserve") ||
    (id === "reserved" && active === "reserved") ||
    (id === "parking" && active === "parked");

  return (
    <nav className="navbar">
      <div className="navInner">
        <button className="navLogo" onClick={() => go("home")}>
          🗺️ Mall<span>Mate</span>
        </button>

        <div className="navLinks">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`navLink ${isActive(item.id) ? "navLinkActive" : ""}`}
              onClick={() => go(item.id)}
            >
              {item.icon} {t.tabs[item.labelKey]}
            </button>
          ))}
        </div>

        <div className="navRight">
          <div className="langRow">
            <button className={`langBtn ${lang === "th" ? "langBtnActive" : ""}`} onClick={() => setLang("th")}>TH</button>
            <button className={`langBtn ${lang === "en" ? "langBtnActive" : ""}`} onClick={() => setLang("en")}>EN</button>
          </div>
          <button
            className="navLink"
            style={{ gap: 6 }}
            onClick={() => go("profile-view")}
          >
            👤 {t.tabs.profile}
          </button>
        </div>
      </div>
    </nav>
  );
}
