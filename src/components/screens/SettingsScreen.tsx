"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";

export default function SettingsScreen({ t, lang, setLang, go }: ScreenProps) {
  const [notif, setNotif] = useState(true);
  const [dark,  setDark]  = useState(true);

  return (
    <div className="pageContent pageContentMed">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button className="btn btnGhost btnSm" onClick={() => go("profile-view", null, true)}>← {t.back}</button>
        <h1 className="pageTitle" style={{ marginBottom: 0 }}>{t.settings}</h1>
      </div>

      <div className="stack">
        <div className="settingsRow" onClick={() => setNotif(v => !v)}>
          <div className="settingsLeft">
            <span className="settingsIcon">🔔</span>
            <div>
              <div className="settingsLabel">{t.notifications}</div>
              <div className="settingsSub">Queue alerts, parking reminders</div>
            </div>
          </div>
          <button className={`toggle ${notif ? "toggleOn" : "toggleOff"}`}
            onClick={e => { e.stopPropagation(); setNotif(v => !v); }} />
        </div>

        <div className="settingsRow" onClick={() => setDark(v => !v)}>
          <div className="settingsLeft">
            <span className="settingsIcon">🌙</span>
            <div>
              <div className="settingsLabel">{t.darkMode}</div>
              <div className="settingsSub">Always on</div>
            </div>
          </div>
          <button className={`toggle ${dark ? "toggleOn" : "toggleOff"}`}
            onClick={e => { e.stopPropagation(); setDark(v => !v); }} />
        </div>

        <div className="settingsRow">
          <div className="settingsLeft">
            <span className="settingsIcon">🌐</span>
            <div>
              <div className="settingsLabel">{t.language}</div>
              <div className="settingsSub">{lang === "th" ? "ภาษาไทย" : "English"}</div>
            </div>
          </div>
          <div className="row">
            {(["en","th"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`btn btnSm ${lang === l ? "btnPrimary" : "btnGhost"}`}
                style={{ padding: "6px 14px" }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="settingsRow" style={{ cursor: "default" }}>
          <div className="settingsLeft">
            <span className="settingsIcon">ℹ️</span>
            <div>
              <div className="settingsLabel">{t.version}</div>
              <div className="settingsSub">1.0.0</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt32">
        <button className="btn btnDanger">{t.logout}</button>
      </div>
    </div>
  );
}
