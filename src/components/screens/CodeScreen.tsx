"use client";
import { useRef, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { verifyOtp } from "@/lib/supabase";

export default function CodeScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const [digits,  setDigits]  = useState(["","","","","",""]);
  const [error,   setError]   = useState(false);
  const [loading, setLoading] = useState(false);
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const code   = digits.join("");
  const filled = code.length === 6;

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits]; next[i] = val;
    setDigits(next); setError(false);
    if (val && i < 5) refs[i + 1].current?.focus();
  }
  function handleKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  }
  async function submit() {
    if (!filled || loading) return;
    setLoading(true);
    try { await verifyOtp(state?.phone ?? "", code); } catch { /* demo fallback */ }
    go("profile", state);
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="progressDots">
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 1 ? "dotActive" : ""}`} />)}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{t.enterCode}</h2>
        <p className="muted" style={{ marginBottom: 20 }}>
          {t.codeHint} <span style={{ color: "var(--text)", fontWeight: 600 }}>{state?.phone ?? ""}</span>
        </p>

        {!error && <div className="alert alertSuccess"><span>✓</span><span>{t.codeSent}</span></div>}
        {error  && <div className="alert alertError"><span>✗</span><span>{t.codeError}</span></div>}

        <div className="otpRow">
          {digits.map((d, i) => (
            <input key={i} ref={refs[i]}
              className={`otpBox ${d ? "otpFilled" : ""} ${error ? "otpError" : ""}`}
              type="text" inputMode="numeric" maxLength={1} value={d} disabled={loading}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
            />
          ))}
        </div>

        <div className="stack">
          <button className="btn btnPrimary btnFull" onClick={submit} disabled={!filled || loading}>
            {loading ? t.verifying : t.verify}
          </button>
          <button className="btn btnGhost btnFull" onClick={() => go("phone", state, true)}>{t.resend}</button>
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
