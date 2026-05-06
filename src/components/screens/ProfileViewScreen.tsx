"use client";
import type { ScreenProps } from "@/lib/types";

export default function ProfileViewScreen({ t, go }: ScreenProps) {
  return (
    <div className="pageContent pageContentMed">
      <h1 className="pageTitle mb24">{t.yourProfile}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" }}>
        {/* Left: Avatar card */}
        <div className="card" style={{ textAlign: "center" }}>
          <div className="avatar" style={{ margin: "0 auto 16px" }}>👤</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>John Doe</h3>
          <p className="muted" style={{ fontSize: 13 }}>+66 81 234 5678</p>
          <div className="divider" />
          <button className="btn btnDanger btnFull btnSm">{t.logout}</button>
        </div>

        {/* Right: Menu items */}
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
