"use client";
import type { ScreenProps } from "@/lib/types";
import LangToggle from "@/components/LangToggle";

export default function LocationScreen({ t, lang, setLang, go }: ScreenProps) {
  return (
    <div className="screen screenCenter">
      <LangToggle lang={lang} setLang={setLang} />
      <div style={{ width: "100%", textAlign: "center" }}>
        <div className="progressDots" style={{ justifyContent: "center" }}>
          {[0,1,2,3].map(i => <div key={i} className={`dot ${i === 3 ? "dotActive" : ""}`} />)}
        </div>
        <div style={{ fontSize: 72, animation: "float 3s ease-in-out infinite", margin: "24px 0" }}>📍</div>
        <h2 className="title">{t.enableLocation}</h2>
        <p className="subtitle" style={{ marginBottom: 36 }}>{t.locationDesc}</p>
        <div className="stack">
          <button className="btn btnPrimary" onClick={() => go("home")}>{t.allowLocation}</button>
          <button className="btn btnGhost"   onClick={() => go("home")}>{t.skipLocation}</button>
        </div>
      </div>
    </div>
  );
}
