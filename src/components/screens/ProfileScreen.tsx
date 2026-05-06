"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { updateProfile } from "@/lib/supabase";

export default function ProfileScreen({ t, go, state }: ScreenProps) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try { await updateProfile(name, email); } catch { /* ignore */ }
    go("location", { ...state, name, email });
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="progressDots">
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 2 ? "dotActive" : ""}`} />)}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.setupProfile}</h2>
        <p className="muted mb24">{t.profileHint}</p>

        <div className="inputWrap">
          <span className="label">{t.fullName}</span>
          <input className="input" type="text" placeholder={t.namePh} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="inputWrap">
          <span className="label">{t.email}</span>
          <input className="input" type="email" placeholder={t.emailPh} value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="stack mt8">
          <button className="btn btnPrimary btnFull" onClick={save} disabled={loading}>
            {loading ? t.verifying : t.saveProfile}
          </button>
          <button className="btn btnGhost btnFull" onClick={() => go("location", state)}>{t.skip}</button>
        </div>
      </div>
    </div>
  );
}
