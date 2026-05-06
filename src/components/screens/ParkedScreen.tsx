"use client";
import type { ScreenProps } from "@/lib/types";
import { MALLS } from "@/lib/data";
import LangToggle from "@/components/LangToggle";

export default function ParkedScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const spot = state?.spot ?? "A3";
  const mall = state?.mall ?? MALLS[0];

  return (
    <div className="screen screenCenter">
      <LangToggle lang={lang} setLang={setLang} />
      <div style={{ width: "100%", textAlign: "center" }}>
        <div className="checkCircle">✅</div>
        <h2 className="title">{t.parkingSaved}</h2>
        <p className="subtitle" style={{ marginBottom: 28 }}>{t.parkingNote}</p>

        <div className="confirmCard" style={{ marginBottom: 28 }}>
          <h3>{mall.name}</h3>
          <div className="confirmBigNum">{spot}</div>
          <p>{t.level} 2 · {t.zone} {spot}</p>
        </div>

        <div className="stack">
          <button className="btn btnPrimary" onClick={() => go("home")}>{t.navigateBack}</button>
          <button className="btn btnGhost"   onClick={() => go("home")}>{t.explore}</button>
        </div>
      </div>
    </div>
  );
}
