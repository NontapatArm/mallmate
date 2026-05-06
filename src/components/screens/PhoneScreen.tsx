"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import LangToggle from "@/components/LangToggle";

export default function PhoneScreen({ t, lang, setLang, go }: ScreenProps) {
  const [phone, setPhone] = useState("");
  const valid = phone.replace(/\D/g, "").length >= 9;

  function submit() {
    if (!valid) return;
    go("phone-loading", { phone });
  }

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />
      <button className="navBack" style={{ marginBottom: 28, alignSelf: "flex-start" }} onClick={() => go("welcome", null, true)}>←</button>

      <div style={{ marginBottom: 32 }}>
        <div className="progressDots">
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 0 ? "dotActive" : ""}`} />)}
        </div>
        <h2 className="title" style={{ fontSize: 28 }}>{t.enterPhone}</h2>
        <p className="subtitle">{t.phoneHint}</p>
      </div>

      <div className="inputWrap">
        <span className="label">{t.phone}</span>
        <div className="phoneRow">
          <div className="phonePrefix">🇹🇭 +66</div>
          <input
            className="input"
            type="tel"
            placeholder="8X XXX XXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{ flex: 1 }}
          />
        </div>
      </div>

      <div className="spacer" />
      <div className="stack">
        <button className="btn btnPrimary" onClick={submit} disabled={!valid}>{t.sendCode}</button>
        <button className="btn btnGhost" onClick={() => go("home")}>{t.skip}</button>
      </div>
    </div>
  );
}
