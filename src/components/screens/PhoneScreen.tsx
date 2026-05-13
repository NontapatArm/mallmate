"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { signInWithPhone } from "@/lib/supabase";

export default function PhoneScreen({ t, lang, setLang, go }: ScreenProps) {
  const [phone,   setPhone]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const valid = phone.replace(/\D/g, "").length >= 9;

  async function submit() {
    if (!valid || loading) return;
    setLoading(true); setError("");
    const full = "+66" + phone.replace(/\D/g, "").replace(/^0/, "");
    try {
      await signInWithPhone(full);
      go("code", { phone: full });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "";
      setError(msg || t.smsFailed);
      setLoading(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="progressDots">
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 0 ? "dotActive" : ""}`} />)}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.enterPhone}</h2>
        <p className="muted mb24">{t.phoneHint}</p>

        {error && <div className="alert alertError"><span>✗</span><span>{error}</span></div>}

        <div className="inputWrap">
          <span className="label">{t.phone}</span>
          <div className="phoneRow">
            <div className="phonePrefix">🇹🇭 +66</div>
            <input
              className="input" type="tel" placeholder="8X XXX XXXX"
              value={phone} onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ flex: 1 }} disabled={loading}
            />
          </div>
        </div>

        <div className="stack mt16">
          <button className="btn btnPrimary btnFull" onClick={submit} disabled={!valid || loading}>
            {loading ? t.verifying : t.sendCode}
          </button>
          <button className="btn btnGhost btnFull" onClick={() => go("home")}>{t.skip}</button>
        </div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
          <div className="langRow">
            <button className={`langBtn ${lang === "th" ? "langBtnActive" : ""}`} onClick={() => setLang("th")}>TH</button>
            <button className={`langBtn ${lang === "en" ? "langBtnActive" : ""}`} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </div>
    </div>
  );
}
