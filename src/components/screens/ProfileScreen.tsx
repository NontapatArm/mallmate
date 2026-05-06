"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { updateProfile } from "@/lib/supabase";
import LangToggle from "@/components/LangToggle";

export default function ProfileScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      await updateProfile(name, email);
    } catch { /* ignore if not logged in yet */ }
    go("location", { ...state, name, email });
  }

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />
      <button className="navBack" style={{ marginBottom: 28, alignSelf: "flex-start" }} onClick={() => go("code", state, true)}>←</button>

      <div style={{ marginBottom: 28 }}>
        <div className="progressDots">
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 2 ? "dotActive" : ""}`} />)}
        </div>
        <h2 className="title" style={{ fontSize: 28 }}>{t.setupProfile}</h2>
        <p className="subtitle">{t.profileHint}</p>
      </div>

      <div className="inputWrap">
        <span className="label">{t.fullName}</span>
        <input className="input" type="text" placeholder={t.namePh} value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="inputWrap">
        <span className="label">{t.email}</span>
        <input className="input" type="email" placeholder={t.emailPh} value={email} onChange={e => setEmail(e.target.value)} />
      </div>

      <div className="spacer" />
      <div className="stack">
        <button className="btn btnPrimary" onClick={save} disabled={loading}>
          {loading ? t.verifying : t.saveProfile}
        </button>
        <button className="btn btnGhost" onClick={() => go("location", state)}>{t.skip}</button>
      </div>
    </div>
  );
}
