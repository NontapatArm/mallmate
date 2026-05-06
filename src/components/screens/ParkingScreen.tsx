"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { MALLS, PARKING_SPOTS, OCCUPIED_SPOTS } from "@/lib/data";
import { saveParking } from "@/lib/supabase";
import LangToggle from "@/components/LangToggle";

export default function ParkingScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const mall = state?.mall ?? MALLS[0];
  const [selected, setSelected] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  async function confirm() {
    if (!selected || loading) return;
    setLoading(true);
    try {
      await saveParking(String(mall.id), "2", selected[0], selected);
    } catch { /* not logged in — still navigate */ }
    go("parked", { mall, spot: selected });
  }

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />

      <div className="navBar">
        <button className="navBack" onClick={() => go("mall-detail", { mall }, true)}>←</button>
        <span className="screenTitle">{t.parkingTitle}</span>
        <div className="navSpacer" />
      </div>

      <div className="mapPh" style={{ height: 160 }}>
        <span className="mapPhIcon">🚗</span>
        <span>Parking Level 2</span>
      </div>

      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 14 }}>{t.pickSpot}</p>

      <div className="parkingGrid" style={{ marginBottom: 16 }}>
        {PARKING_SPOTS.map(s => {
          const occupied = OCCUPIED_SPOTS.includes(s);
          const sel      = selected === s;
          return (
            <button
              key={s}
              className={`spotBtn ${occupied ? "spotOccupied" : sel ? "spotSelected" : ""}`}
              disabled={occupied || loading}
              onClick={() => setSelected(s)}
            >{s}</button>
          );
        })}
      </div>

      {selected && (
        <div className="alert alertInfo" style={{ marginBottom: 12 }}>
          🚗 {t.level} 2 · {t.zone} {selected}
        </div>
      )}

      <div className="spacer" />
      <button className="btn btnPrimary" disabled={!selected || loading} onClick={confirm}>
        {loading ? t.verifying : t.confirmSpot}
      </button>
    </div>
  );
}
