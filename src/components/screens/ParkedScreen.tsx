"use client";
import type { ScreenProps } from "@/lib/types";
import { MALLS } from "@/lib/data";

export default function ParkedScreen({ t, go, state }: ScreenProps) {
  const spot = state?.spot ?? "A3";
  const mall = state?.mall ?? MALLS[0];
  const lat  = state?.lat;
  const lng  = state?.lng;

  function navigateToCar() {
    const url = lat != null && lng != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mall.name + " parking")}`;
    window.open(url, "_blank");
  }

  return (
    <div className="pageContent pageContentNarrow" style={{ margin: "0 auto", paddingTop: 60 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="checkCircle">✅</div>
        <h1 className="pageTitle">{t.parkingSaved}</h1>
        <p className="muted">{t.parkingNote}</p>
      </div>

      <div className="confirmCard mb24">
        <h3>{mall.name}</h3>
        <div className="confirmBigNum">{spot}</div>
        <p>{t.level} 2 · {t.zone} {spot}</p>
      </div>

      <div className="stack">
        <button className="btn btnPrimary btnFull" onClick={navigateToCar}>{t.navigateBack}</button>
        <button className="btn btnGhost btnFull"   onClick={() => go("home")}>{t.explore}</button>
      </div>
    </div>
  );
}
