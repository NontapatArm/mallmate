"use client";
import type { ScreenProps } from "@/lib/types";
import LangToggle from "@/components/LangToggle";
import TabBar from "@/components/TabBar";

export default function ProfileViewScreen({ t, lang, setLang, go }: ScreenProps) {
  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />

      <div style={{ textAlign: "center", marginTop: 16, marginBottom: 28 }}>
        <div className="avatar">👤</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>John Doe</h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>+66 81 234 5678</p>
      </div>

      <div className="stack" style={{ marginBottom: 16 }}>
        {([
          { icon: "🕐", label: t.history,   sub: "12 visits" },
          { icon: "❤️", label: t.favorites, sub: "5 saved malls" },
        ] as const).map(item => (
          <div key={item.label} className="settingsRow">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div className="settingsLabel">{item.label}</div>
                <div className="settingsSub">{item.sub}</div>
              </div>
            </div>
            <span className="settingsArrow">›</span>
          </div>
        ))}

        <div className="settingsRow" onClick={() => go("settings")}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>⚙️</span>
            <div className="settingsLabel">{t.settings}</div>
          </div>
          <span className="settingsArrow">›</span>
        </div>
      </div>

      <div className="spacer" />
      <button className="btn btnDanger" style={{ marginBottom: 12 }}>{t.logout}</button>
      <TabBar active="profile" t={t} go={go} />
    </div>
  );
}
