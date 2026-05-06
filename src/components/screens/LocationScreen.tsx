"use client";
import type { ScreenProps } from "@/lib/types";

export default function LocationScreen({ t, go }: ScreenProps) {
  return (
    <div className="authWrap">
      <div className="authCard" style={{ textAlign: "center" }}>
        <div className="progressDots" style={{ justifyContent: "center" }}>
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 3 ? "dotActive" : ""}`} />)}
        </div>
        <div style={{ fontSize: 64, animation: "float 3s ease-in-out infinite", marginBottom: 20 }}>📍</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{t.enableLocation}</h2>
        <p className="muted mb24">{t.locationDesc}</p>
        <div className="stack">
          <button className="btn btnPrimary btnFull" onClick={() => go("home")}>{t.allowLocation}</button>
          <button className="btn btnGhost btnFull"   onClick={() => go("home")}>{t.skipLocation}</button>
        </div>
      </div>
    </div>
  );
}
