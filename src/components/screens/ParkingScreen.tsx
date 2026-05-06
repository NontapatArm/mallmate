"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { MALLS, PARKING_SPOTS, OCCUPIED_SPOTS } from "@/lib/data";
import { saveParking } from "@/lib/supabase";

export default function ParkingScreen({ t, go, state }: ScreenProps) {
  const mall = state?.mall ?? MALLS[0];
  const [selected, setSelected] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  async function confirm() {
    if (!selected || loading) return;
    setLoading(true);
    try { await saveParking(String(mall.id), "2", selected[0], selected); } catch { /* demo */ }
    go("parked", { mall, spot: selected });
  }

  return (
    <div className="pageContent pageContentMed">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button className="btn btnGhost btnSm" onClick={() => go("mall-detail", { mall }, true)}>← {t.back}</button>
        <h1 className="pageTitle" style={{ marginBottom: 0 }}>{t.parkingTitle}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>
        <div>
          <div className="mapPh" style={{ height: 220 }}>
            <span className="mapPhIcon">🚗</span>
            <span>Parking Level 2 — {mall.name}</span>
          </div>

          <p className="muted mb16" style={{ fontSize: 14 }}>{t.pickSpot}</p>
          <div className="parkingGrid">
            {PARKING_SPOTS.map(s => {
              const occ = OCCUPIED_SPOTS.includes(s);
              const sel = selected === s;
              return (
                <button key={s} className={`spotBtn ${occ ? "spotOccupied" : sel ? "spotSelected" : ""}`}
                  disabled={occ || loading} onClick={() => setSelected(s)}>{s}</button>
              );
            })}
          </div>
        </div>

        <div className="card" style={{ position: "sticky", top: "calc(var(--nav-h) + 24px)" }}>
          <h3 style={{ marginBottom: 16 }}>{mall.name}</h3>
          {selected ? (
            <div className="alert alertInfo mb16">🚗 {t.level} 2 · {t.zone} {selected}</div>
          ) : (
            <p className="muted mb16" style={{ fontSize: 14 }}>{t.pickSpot}</p>
          )}
          <button className="btn btnPrimary btnFull" disabled={!selected || loading} onClick={confirm}>
            {loading ? t.verifying : t.confirmSpot}
          </button>
        </div>
      </div>
    </div>
  );
}
