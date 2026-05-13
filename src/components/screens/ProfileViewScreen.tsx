"use client";
import { useEffect, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { useLiff } from "@/context/LiffContext";
import { getProfileStats } from "@/lib/supabase";

export default function ProfileViewScreen({ t, go }: ScreenProps) {
  const { loggedIn, profile, logout } = useLiff();
  const [stats, setStats] = useState<{ queueCount: number; favCount: number } | null>(null);

  useEffect(() => {
    getProfileStats().then(setStats).catch(() => {});
  }, []);

  const name = profile?.displayName ?? "Guest";
  const pic  = profile?.pictureUrl;

  return (
    <div className="pageContent" style={{ maxWidth: 480, margin: "0 auto" }}>
      <h1 className="pageTitle mb24">{t.yourProfile}</h1>

      {/* ── Hero card ── */}
      <div className="card" style={{ textAlign: "center", padding: "32px 24px 24px", marginBottom: 16 }}>
        {/* Avatar */}
        {pic ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pic} alt={name} width={88} height={88} style={{
            borderRadius: "50%", objectFit: "cover",
            margin: "0 auto 14px", display: "block",
            border: "3px solid rgba(255,45,85,0.35)",
            boxShadow: "0 0 0 6px rgba(255,45,85,0.08)",
          }} />
        ) : (
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: "var(--red-dim)", border: "3px solid rgba(255,45,85,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36, margin: "0 auto 14px",
          }}>👤</div>
        )}

        {/* Name */}
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{name}</h2>

        {/* Status message */}
        {profile?.statusMessage && (
          <p className="muted" style={{ fontSize: 13, marginBottom: 10 }}>{profile.statusMessage}</p>
        )}

        {/* LINE badge */}
        {loggedIn && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(6,199,85,0.1)", border: "1px solid rgba(6,199,85,0.25)",
            borderRadius: 20, padding: "4px 12px", marginBottom: 20,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#06C755", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#06C755", fontWeight: 600 }}>LINE Connected</span>
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 1, background: "var(--border)",
          borderRadius: 12, overflow: "hidden", marginBottom: 20,
        }}>
          {[
            { icon: "🕐", value: stats?.queueCount ?? "—", label: t.visitsThisMonth },
            { icon: "❤️", value: stats?.favCount   ?? "—", label: t.savedMalls },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--surface)", padding: "14px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div className="muted" style={{ fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          className="btn btnDanger btnFull btnSm"
          onClick={() => { logout(); go("welcome"); }}
        >
          {t.logout}
        </button>
      </div>

      {/* ── Menu rows ── */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {[
          { icon: "🕐", label: t.history,   sub: stats ? `${stats.queueCount} ${t.visitsThisMonth}` : "—", action: () => go("report") },
          { icon: "❤️", label: t.favorites, sub: stats ? `${stats.favCount} ${t.savedMalls}` : "—",         action: () => go("report") },
          { icon: "⚙️", label: t.settings,  sub: "",                                                          action: () => go("settings") },
        ].map((item, i, arr) => (
          <div key={item.label}>
            <div
              className="settingsRow"
              onClick={item.action}
              style={{ cursor: "pointer", padding: "16px 20px" }}
            >
              <div className="settingsLeft">
                <span className="settingsIcon">{item.icon}</span>
                <div>
                  <div className="settingsLabel">{item.label}</div>
                  {item.sub && <div className="settingsSub">{item.sub}</div>}
                </div>
              </div>
              <span className="settingsArrow">›</span>
            </div>
            {i < arr.length - 1 && <div style={{ height: 1, background: "var(--border)", margin: "0 20px" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
