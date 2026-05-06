"use client";
import type { ScreenId, Lang } from "@/lib/types";
import type { Translations } from "@/lib/i18n";
import { useLiff } from "@/context/LiffContext";

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
  const { loggedIn, profile, logout } = useLiff();

  const isActive = (id: ScreenId) =>
    id === active ||
    (id === "mall-detail" && active === "reserve") ||
    (id === "reserved"    && active === "reserved") ||
    (id === "parking"     && active === "parked");

  return (
    <nav className="navbar">
      <div className="navInner">
        {/* Logo */}
        <button className="navLogo" onClick={() => go("home")}>
          <div className="logoIcon">🗺️</div>
          <div className="logoText">Mall<span>Mate</span></div>
        </button>

        {/* Nav links */}
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

        {/* Right side */}
        <div className="navRight">
          {/* Lang toggle */}
          <div className="langRow">
            <button className={`langBtn ${lang === "th" ? "langBtnActive" : ""}`} onClick={() => setLang("th")}>TH</button>
            <button className={`langBtn ${lang === "en" ? "langBtnActive" : ""}`} onClick={() => setLang("en")}>EN</button>
          </div>

          {/* Profile */}
          {loggedIn && profile ? (
            <button
              className="navLink"
              onClick={() => go("profile-view")}
              style={{ gap: 8, padding: "4px 10px 4px 4px" }}
              title={profile.displayName}
            >
              {profile.pictureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.pictureUrl}
                  alt={profile.displayName}
                  width={28} height={28}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <span style={{
                  width: 28, height: 28, background: "var(--red-dim)", borderRadius: "50%",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>👤</span>
              )}
              <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                {profile.displayName}
              </span>
            </button>
          ) : (
            <button className="navLink" onClick={() => go("profile-view")}>
              👤 {t.tabs.profile}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
