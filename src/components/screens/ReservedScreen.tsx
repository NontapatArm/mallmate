"use client";
import type { ScreenProps } from "@/lib/types";
import { MALLS, STORES } from "@/lib/data";
import LangToggle from "@/components/LangToggle";

export default function ReservedScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const store = state?.store ?? STORES[0];
  const mall  = state?.mall  ?? MALLS[0];

  return (
    <div className="screen screenCenter">
      <LangToggle lang={lang} setLang={setLang} />
      <div style={{ width: "100%", textAlign: "center" }}>
        <div className="checkCircle checkRed">🎟️</div>
        <h2 className="title">{t.queueConfirmed}</h2>
        <p className="subtitle" style={{ marginBottom: 28 }}>{t.queueNote}</p>

        <div className="confirmCard" style={{ marginBottom: 28 }}>
          <h3>{store.name}</h3>
          <div className="confirmBigNum">{store.wait}</div>
          <p>{t.yourTurnIn} · <span style={{ color: "#fff", fontWeight: 600 }}>{store.wait} {t.minutes}</span></p>
        </div>

        <div className="stack">
          <button className="btn btnPrimary" onClick={() => go("home")}>{t.explore}</button>
          <button className="btn btnGhost"   onClick={() => go("mall-detail", { mall }, true)}>{t.back}</button>
        </div>
      </div>
    </div>
  );
}
