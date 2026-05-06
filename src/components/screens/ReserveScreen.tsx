"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { MALLS, STORES } from "@/lib/data";
import { reserveQueue } from "@/lib/supabase";
import LangToggle from "@/components/LangToggle";

export default function ReserveScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const store = state?.store ?? STORES[0];
  const mall  = state?.mall  ?? MALLS[0];
  const [party,   setParty]   = useState(2);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function reserve() {
    setLoading(true);
    setError("");
    try {
      await reserveQueue(String(store.id), String(mall.id), party, store.wait);
    } catch { /* not logged in — still navigate for demo */ }
    go("reserved", { mall, store });
  }

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />

      <div className="navBar">
        <button className="navBack" onClick={() => go("mall-detail", { mall }, true)}>←</button>
        <span className="screenTitle">{store.name}</span>
        <div className="navSpacer" />
      </div>

      <div className="mapPh" style={{ height: 140 }}>
        <span style={{ fontSize: 36 }}>{store.icon}</span>
        <span style={{ fontSize: 13 }}>{t.level} {store.floor}</span>
      </div>

      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 15, marginBottom: 6 }}>
          ⏱ {t.waitAvg}: <span style={{ color: "#fff", fontWeight: 600 }}>{store.wait} {t.minutes}</span>
        </p>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>4 {t.partiesAhead}</p>
      </div>

      {error && <div className="alert alertError" style={{ marginBottom: 16 }}><span>✗</span><span>{error}</span></div>}

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Party size</p>
        <div className="row">
          {[1,2,3,4].map(n => (
            <button
              key={n}
              onClick={() => setParty(n)}
              style={{
                width: 44, height: 44, borderRadius: 10, border: "1.5px solid",
                borderColor: party === n ? "var(--red)" : "var(--border)",
                background:  party === n ? "var(--red-dim)" : "transparent",
                color:       party === n ? "var(--red)" : "var(--muted)",
                fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}
            >{n}</button>
          ))}
        </div>
      </div>

      <div className="spacer" />
      <div className="stack">
        <button className="btn btnPrimary" onClick={reserve} disabled={loading}>
          {loading ? t.verifying : t.reserveQueue}
        </button>
        <button className="btn btnGhost" onClick={() => go("mall-detail", { mall }, true)}>{t.back}</button>
      </div>
    </div>
  );
}
