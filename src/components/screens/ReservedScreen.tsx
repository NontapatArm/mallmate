"use client";
import type { ScreenProps } from "@/lib/types";
import { MALLS, STORES } from "@/lib/data";

export default function ReservedScreen({ t, go, state }: ScreenProps) {
  const store = state?.store ?? STORES[0];
  const mall  = state?.mall  ?? MALLS[0];

  return (
    <div className="pageContent pageContentNarrow" style={{ margin: "0 auto", paddingTop: 60 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="checkCircle checkRed">🎟️</div>
        <h1 className="pageTitle">{t.queueConfirmed}</h1>
        <p className="muted">{t.queueNote}</p>
      </div>

      <div className="confirmCard mb24">
        <h3>{store.name}</h3>
        <div className="confirmBigNum">{store.wait}</div>
        <p>{t.yourTurnIn} · <span style={{ color: "var(--text)", fontWeight: 600 }}>{store.wait} {t.minutes}</span></p>
      </div>

      <div className="stack">
        <button className="btn btnPrimary btnFull" onClick={() => go("home")}>{t.explore}</button>
        <button className="btn btnGhost btnFull"   onClick={() => go("mall-detail", { mall }, true)}>{t.back}</button>
      </div>
    </div>
  );
}
