"use client";
import { useEffect, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { MALLS, STORES } from "@/lib/data";
import { reserveQueue, getQueueCount } from "@/lib/supabase";

export default function ReserveScreen({ t, go, state }: ScreenProps) {
  const store = state?.store ?? STORES[0];
  const mall  = state?.mall  ?? MALLS[0];
  const [party,        setParty]        = useState(2);
  const [loading,      setLoading]      = useState(false);
  const [partiesAhead, setPartiesAhead] = useState<number | null>(null);
  const [error,        setError]        = useState("");

  useEffect(() => {
    getQueueCount(String(store.id)).then(setPartiesAhead).catch(() => {});
  }, [store.id]);

  async function reserve() {
    setLoading(true); setError("");
    let reservationId: string | undefined;
    try {
      const r = await reserveQueue(String(store.id), String(mall.id), party, store.wait);
      reservationId = r?.id;
      go("reserved", { mall, store, reservationId });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "ไม่สามารถจองคิวได้ กรุณาลองใหม่");
      setLoading(false);
    }
  }

  return (
    <div className="pageContent">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button className="btn btnGhost btnSm" onClick={() => go("mall-detail", { mall }, true)}>
          ← {t.back}
        </button>
        <h1 className="pageTitle" style={{ marginBottom: 0 }}>{store.name}</h1>
      </div>

      {/* Store map */}
      <div className="mapPh" style={{ height: 180, marginBottom: 24 }}>
        <span style={{ fontSize: 52 }}>{store.icon}</span>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>{t.level} {store.floor} · {mall.name}</span>
      </div>

      {/* Wait info */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
        marginBottom: 28,
      }}>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 6 }}>{t.waitAvg}</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "var(--red)", lineHeight: 1 }}>{store.wait}</p>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{t.minutes}</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 6 }}>{t.partiesAhead}</p>
          <p style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{partiesAhead ?? "—"}</p>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>parties</p>
        </div>
      </div>

      {/* Party size */}
      <div className="card" style={{ marginBottom: 28 }}>
        <p style={{ fontWeight: 600, marginBottom: 16 }}>Party size</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[1,2,3,4,5,6].map(n => (
            <button
              key={n}
              onClick={() => setParty(n)}
              style={{
                width: 52, height: 52, borderRadius: 12, border: "1.5px solid",
                borderColor: party === n ? "var(--red)" : "var(--border)",
                background:  party === n ? "var(--red-dim)" : "transparent",
                color:       party === n ? "var(--red)" : "var(--muted)",
                fontWeight: 700, fontSize: 18, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.15s",
              }}
            >{n}</button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alertError"><span>✗</span><span>{error}</span></div>}

      {/* CTA */}
      <div className="stack">
        <button className="btn btnPrimary btnFull" onClick={reserve} disabled={loading}>
          {loading ? t.verifying : `⏰ ${t.reserveQueue}`}
        </button>
        <button className="btn btnGhost btnFull" onClick={() => go("mall-detail", { mall }, true)}>
          {t.back}
        </button>
      </div>
    </div>
  );
}
