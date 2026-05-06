"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import LangToggle from "@/components/LangToggle";

export default function SettingsScreen({ t, lang, setLang, go }: ScreenProps) {
  const [notif, setNotif] = useState(true);
  const [dark,  setDark]  = useState(true);

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />

      <div className="navBar">
        <button className="navBack" onClick={() => go("profile-view", null, true)}>←</button>
        <span className="screenTitle">{t.settings}</span>
        <div className="navSpacer" />
      </div>

      <div className="stack">
        <div className="settingsRow" onClick={() => setNotif(v => !v)}>
          <div>
            <div className="settingsLabel">{t.notifications}</div>
            <div className="settingsSub">Queue alerts, parking reminders</div>
          </div>
          <button
            className={`toggle ${notif ? "toggleOn" : "toggleOff"}`}
            onClick={e => { e.stopPropagation(); setNotif(v => !v); }}
          />
        </div>

        <div className="settingsRow" onClick={() => setDark(v => !v)}>
          <div>
            <div className="settingsLabel">{t.darkMode}</div>
            <div className="settingsSub">Always on</div>
          </div>
          <button
            className={`toggle ${dark ? "toggleOn" : "toggleOff"}`}
            onClick={e => { e.stopPropagation(); setDark(v => !v); }}
          />
        </div>

        <div className="settingsRow">
          <div>
            <div className="settingsLabel">{t.language}</div>
            <div className="settingsSub">{lang === "th" ? "ภาษาไทย" : "English"}</div>
          </div>
          <div className="row">
            {(["en","th"] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: "4px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontWeight: 600, fontSize: 13,
                  background: lang === l ? "var(--red)" : "#1a1a1a",
                  color:      lang === l ? "#fff"       : "var(--muted)",
                  transition: "all 0.15s",
                }}
              >{l.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <div className="settingsRow" style={{ cursor: "default" }}>
          <div>
            <div className="settingsLabel">{t.version}</div>
            <div className="settingsSub">1.0.0</div>
          </div>
        </div>
      </div>

      <div className="spacer" />
      <button className="btn btnDanger" style={{ marginTop: 16 }}>{t.logout}</button>
    </div>
  );
}
