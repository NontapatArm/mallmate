"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { MALLS, STORES } from "@/lib/data";
import { reserveQueue } from "@/lib/supabase";

export default function ReserveScreen({ t, go, state }: ScreenProps) {
  const store = state?.store ?? STORES[0];
  const mall  = state?.mall  ?? MALLS[0];
  const [party,   setParty]   = useState(2);
  const [loading, setLoading] = useState(false);

  async function reserve() {
    setLoading(true);
    try { await reserveQueue(String(store.id), String(mall.id), party, store.wait); } catch { /* demo */ }
    go("reserved", { mall, store });
  }

  return (
    <div className="pageContent pageContentMed">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button className="btn btnGhost btnSm" onClick={() => go("mall-detail", { mall }, true)}>← {t.back}</button>
        <h1 className="pageTitle" style={{ marginBottom: 0 }}>{store.name}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
        <div>
          <div className="mapPh" style={{ height: 200 }}>
            <span style={{ fontSize: 48 }}>{store.icon}</span>
            <span>{t.level} {store.floor}</span>
          </div>

          <div className="card mt16">
            <p style={{ marginBottom: 4 }}>⏱ {t.waitAvg}: <span style={{ color: "var(--text)", fontWeight: 700 }}>{store.wait} {t.minutes}</span></p>
            <p className="muted" style={{ fontSize: 13 }}>4 {t.partiesAhead}</p>
          </div>
        </div>

        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 16 }}>Party size</p>
          <div className="row mb24" style={{ flexWrap: "wrap" }}>
            {[1,2,3,4,5,6].map(n => (
              <button key={n} onClick={() => setParty(n)} style={{
                width: 48, height: 48, borderRadius: 10, border: "1.5px solid",
                borderColor: party === n ? "var(--red)" : "var(--border)",
                background:  party === n ? "var(--red-dim)" : "transparent",
                color:       party === n ? "var(--red)" : "var(--muted)",
                fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>{n}</button>
            ))}
          </div>
          <div className="stack">
            <button className="btn btnPrimary btnFull" onClick={reserve} disabled={loading}>
              {loading ? t.verifying : t.reserveQueue}
            </button>
            <button className="btn btnGhost btnFull" onClick={() => go("mall-detail", { mall }, true)}>{t.back}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
