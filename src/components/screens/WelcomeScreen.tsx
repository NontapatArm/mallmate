"use client";
import type { ScreenProps } from "@/lib/types";

export default function WelcomeScreen({ t, go }: ScreenProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <div className="hero" style={{ padding: "100px 24px 64px" }}>
        <div className="heroIcon">🗺️</div>
        <h1 className="heroTitle">
          Mall<span>Mate</span>
        </h1>
        <p className="heroSub" style={{ whiteSpace: "pre-line" }}>{t.tagline}</p>
        <div className="heroCta">
          <button className="btn btnPrimary" style={{ minWidth: 160 }} onClick={() => go("phone")}>
            {t.getStarted} →
          </button>
          <button className="btn btnGhost" style={{ minWidth: 120 }} onClick={() => go("home")}>
            {t.skip}
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px", width: "100%" }}>
        <div className="grid3">
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
      </div>
    </div>
  );
}
