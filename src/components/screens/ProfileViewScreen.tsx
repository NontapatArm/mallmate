"use client";
import type { ScreenProps } from "@/lib/types";
import { useLiff } from "@/context/LiffContext";

export default function ProfileViewScreen({ t, go }: ScreenProps) {
  const { loggedIn, profile, logout } = useLiff();

  const name  = profile?.displayName ?? "Guest";
  const pic   = profile?.pictureUrl;

  return (
    <div className="pageContent pageContentMed">
      <h1 className="pageTitle mb24">{t.yourProfile}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" }}>
        {/* Avatar card */}
        <div className="card" style={{ textAlign: "center" }}>
          {pic ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pic} alt={name} width={80} height={80}
              style={{ borderRadius: "50%", objectFit: "cover", margin: "0 auto 16px", display: "block", border: "2px solid rgba(255,45,85,0.25)" }} />
          ) : (
            <div className="avatar" style={{ margin: "0 auto 16px" }}>👤</div>
          )}
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{name}</h3>
          {profile?.statusMessage && (
            <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{profile.statusMessage}</p>
          )}
          {loggedIn && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06C755", display: "inline-block" }} />
              <span style={{ fontSize: 12, color: "#06C755", fontWeight: 600 }}>LINE Connected</span>
            </div>
          )}
          <div className="divider" />
          <button className="btn btnDanger btnFull btnSm" onClick={() => { logout(); go("welcome"); }}>
            {t.logout}
          </button>
        </div>

        {/* Menu */}
        <div className="stack">
          {[
            { icon: "🕐", label: t.history,   sub: "12 visits this month" },
            { icon: "❤️", label: t.favorites, sub: "5 saved malls" },
          ].map(item => (
            <div key={item.label} className="settingsRow">
              <div className="settingsLeft">
                <span className="settingsIcon">{item.icon}</span>
                <div>
                  <div className="settingsLabel">{item.label}</div>
                  <div className="settingsSub">{item.sub}</div>
                </div>
              </div>
              <span className="settingsArrow">›</span>
            </div>
          ))}
          <div className="settingsRow" onClick={() => go("settings")}>
            <div className="settingsLeft">
              <span className="settingsIcon">⚙️</span>
              <div className="settingsLabel">{t.settings}</div>
            </div>
            <span className="settingsArrow">›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
