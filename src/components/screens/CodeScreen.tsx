"use client";
import { useRef, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import LangToggle from "@/components/LangToggle";

export default function CodeScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const [digits, setDigits] = useState(["","","","","",""]);
  const [error, setError]   = useState(false);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
                useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const code   = digits.join("");
  const filled = code.length === 6;

  function handleChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError(false);
    if (val && i < 5) refs[i + 1].current?.focus();
  }

  function handleKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i - 1].current?.focus();
  }

  function submit() {
    if (!filled) return;
    // demo: any 6-digit code works
    go("profile", state);
  }

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />
      <button className="navBack" style={{ marginBottom: 28, alignSelf: "flex-start" }} onClick={() => go("phone", null, true)}>←</button>

      <div style={{ marginBottom: 16 }}>
        <div className="progressDots">
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 1 ? "dotActive" : ""}`} />)}
        </div>
        <h2 className="title" style={{ fontSize: 28 }}>{t.enterCode}</h2>
        <p className="subtitle">{t.codeHint} <span style={{ color: "#fff" }}>+66 {state?.phone ?? ""}</span></p>
      </div>

      {!error && <div className="alert alertSuccess"><span>✓</span><span>{t.codeSent}</span></div>}
      {error  && <div className="alert alertError"><span>✗</span><span>{t.codeError}</span></div>}

      <div className="otpRow">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            className={`otpBox ${d ? "otpFilled" : ""} ${error ? "otpError" : ""}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
          />
        ))}
      </div>

      <div className="spacer" />
      <div className="stack">
        <button className="btn btnPrimary" onClick={submit} disabled={!filled}>{t.verify}</button>
        <button className="btn btnGhost" onClick={() => go("phone-loading", state)}>{t.resend}</button>
      </div>
    </div>
  );
}
