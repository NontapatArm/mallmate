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
    <div className="pageContent">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button className="btn btnGhost btnSm" onClick={() => go("mall-detail", { mall }, true)}>
          ← {t.back}
        </button>
        <h1 className="pageTitle" style={{ marginBottom: 0 }}>{t.parkingTitle}</h1>
      </div>

      {/* Map */}
      <div className="mapPh" style={{ height: 200, marginBottom: 24 }}>
        <span style={{ fontSize: 48 }}>🚗</span>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>
          {mall.name} — Level 2
        </span>
      </div>

      {/* Instruction */}
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 16 }}>
        {t.pickSpot}
      </p>

      {/* Spot grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
        gap: 10,
        marginBottom: 24,
      }}>
        {PARKING_SPOTS.map(s => {
          const occ = OCCUPIED_SPOTS.includes(s);
          const sel = selected === s;
          return (
            <button
              key={s}
              className={`spotBtn ${occ ? "spotOccupied" : sel ? "spotSelected" : ""}`}
              disabled={occ || loading}
              onClick={() => setSelected(s)}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        {[
          { color: "var(--surface)",  border: "var(--border)",        label: "Available" },
          { color: "var(--red)",      border: "var(--red)",            label: "Selected" },
          { color: "#0d0d0d",         border: "var(--border)",         label: "Occupied" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 4,
              background: item.color, border: `1.5px solid ${item.border}`,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 12, color: "var(--muted)" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Selection summary + confirm */}
      {selected ? (
        <div style={{
          background: "rgba(255,45,85,0.08)",
          border: "1px solid rgba(255,45,85,0.3)",
          borderRadius: 16,
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 4 }}>{mall.name}</p>
            <p style={{ fontWeight: 700, fontSize: 20 }}>
              {t.level} 2 · {t.zone} <span style={{ color: "var(--red)" }}>{selected}</span>
            </p>
          </div>
          <button
            className="btn btnPrimary"
            style={{ minWidth: 160 }}
            onClick={confirm}
            disabled={loading}
          >
            {loading ? t.verifying : `🚗 ${t.confirmSpot}`}
          </button>
        </div>
      ) : (
        <button className="btn btnPrimary btnFull" disabled>
          {t.confirmSpot}
        </button>
      )}
    </div>
  );
}
