"use client";
import type { ScreenProps } from "@/lib/types";
import { useLiff } from "@/context/LiffContext";

export default function WelcomeScreen({ t, go }: ScreenProps) {
  const { ready, loggedIn, inLineApp, login } = useLiff();

  function handleLogin() {
    if (inLineApp || !ready) {
      login();
    } else {
      go("phone");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <div className="hero" style={{ padding: "100px 24px 64px" }}>
        <div className="heroIcon">🗺️</div>
        <h1 className="heroTitle">Mall<span>Mate</span></h1>
        <p className="heroSub" style={{ whiteSpace: "pre-line" }}>{t.tagline}</p>

        <div className="heroCta">
          {/* LINE Login button */}
          <button
            className="btn btnPrimary"
            style={{ minWidth: 200, background: "#06C755", fontSize: 16, gap: 10 }}
            onClick={handleLogin}
            disabled={!ready}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.141h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            {loggedIn ? t.getStarted : "Login with LINE"}
          </button>

          {/* Web fallback */}
          {!inLineApp && (
            <button className="btn btnGhost" style={{ minWidth: 120 }} onClick={() => go("phone")}>
              {t.phone} →
            </button>
          )}
          <button className="btn btnGhost" style={{ minWidth: 100 }} onClick={() => go("home")}>
            {t.skip}
          </button>
        </div>

        {inLineApp && (
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 16 }}>
            🟢 Running inside LINE
          </p>
        )}
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
