"use client";
import type { ScreenProps } from "@/lib/types";
import LangToggle from "@/components/LangToggle";

export default function WelcomeScreen({ t, lang, setLang, go }: ScreenProps) {
  return (
    <div className="screen screenCenter">
      <LangToggle lang={lang} setLang={setLang} />
      <div style={{ textAlign: "center", width: "100%" }}>
        <div style={{ fontSize: 72, animation: "float 3s ease-in-out infinite", marginBottom: 24 }}>🗺️</div>
        <h1 className="title">{t.appName}</h1>
        <p className="subtitle" style={{ marginBottom: 36, whiteSpace: "pre-line" }}>{t.tagline}</p>

        <div className="stack" style={{ marginBottom: 32, textAlign: "left" }}>
          {t.navFeatures.map((f, i) => (
            <div key={i} className="featureCard">
              <div className="featureIcon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="stack">
          <button className="btn btnPrimary" onClick={() => go("phone")}>{t.getStarted}</button>
          <button className="btn btnGhost"   onClick={() => go("home")}>{t.skip}</button>
        </div>
      </div>
    </div>
  );
}
