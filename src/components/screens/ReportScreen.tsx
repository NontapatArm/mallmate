"use client";
import { useEffect, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import type { Translations } from "@/lib/i18n";
import { getQueueHistory, getParkingHistory, getFavorites, toggleFavorite } from "@/lib/supabase";

type Tab = "queue" | "parking" | "favorites";

interface QueueRecord {
  id: string;
  party_size: number;
  status: string;
  created_at: string;
  stores: unknown;
  malls: unknown;
}

interface ParkingRecord {
  id: string;
  level: string;
  zone: string;
  spot: string;
  status: string;
  saved_at: string;
  malls: unknown;
}

interface FavoriteRecord {
  id: string;
  mall_id: string;
  created_at: string;
  malls: unknown;
}

export default function ReportScreen({ t, go }: ScreenProps) {
  const [tab,            setTab]           = useState<Tab>("queue");
  const [queueHistory,   setQueueHistory]  = useState<QueueRecord[]>([]);
  const [parkingHistory, setParkingHistory] = useState<ParkingRecord[]>([]);
  const [favoriteMalls,  setFavoriteMalls] = useState<FavoriteRecord[]>([]);
  const [loading,        setLoading]       = useState(true);
  const [togglingId,     setTogglingId]    = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getQueueHistory(), getParkingHistory(), getFavorites()])
      .then(([q, p, f]) => {
        setQueueHistory(q as QueueRecord[]);
        setParkingHistory(p as ParkingRecord[]);
        setFavoriteMalls(f as FavoriteRecord[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleRemoveFavorite(mallId: string) {
    setTogglingId(mallId);
    try {
      await toggleFavorite(mallId);
      setFavoriteMalls(prev => prev.filter(f => f.mall_id !== mallId));
    } catch { /* silent */ }
    finally { setTogglingId(null); }
  }

  return (
    <div className="pageContent pageContentMed">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button className="btn btnGhost btnSm" onClick={() => go("profile-view", null, true)}>
          ← {t.back}
        </button>
        <h1 className="pageTitle" style={{ marginBottom: 0 }}>{t.activityReport}</h1>
      </div>

      <div className="tabPills" style={{ marginBottom: 24 }}>
        <button className={`tabPill ${tab === "queue"     ? "tabPillActive" : ""}`} onClick={() => setTab("queue")}>
          ⏰ {t.queueHistory}
        </button>
        <button className={`tabPill ${tab === "parking"   ? "tabPillActive" : ""}`} onClick={() => setTab("parking")}>
          🚗 {t.parkingHistory}
        </button>
        <button className={`tabPill ${tab === "favorites" ? "tabPillActive" : ""}`} onClick={() => setTab("favorites")}>
          ❤️ {t.favorites}
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="stack">
          {tab === "queue" && (
            queueHistory.length === 0
              ? <EmptyState icon="⏰" message={t.noQueueHistory} />
              : queueHistory.map(r => {
                  const store = r.stores as { name: string; icon: string } | null;
                  const mall  = r.malls  as { name: string } | null;
                  return (
                    <div key={r.id} className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div className="storeIcon" style={{ fontSize: 24 }}>{store?.icon ?? "🏪"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{store?.name ?? "—"}</div>
                        <div className="muted" style={{ fontSize: 12 }}>{mall?.name} · {formatDate(r.created_at)}</div>
                        <div className="muted" style={{ fontSize: 12 }}>{t.partySize}: {r.party_size}</div>
                      </div>
                      <StatusBadge status={r.status} t={t} />
                    </div>
                  );
                })
          )}

          {tab === "parking" && (
            parkingHistory.length === 0
              ? <EmptyState icon="🚗" message={t.noParkingHistory} />
              : parkingHistory.map(r => {
                  const mall = r.malls as { name: string } | null;
                  return (
                    <div key={r.id} className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div className="mallIcon">🚗</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{mall?.name ?? "—"}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {t.level} {r.level} · {t.zone} {r.zone} · {r.spot}
                        </div>
                        <div className="muted" style={{ fontSize: 12 }}>{formatDate(r.saved_at)}</div>
                      </div>
                      <StatusBadge status={r.status} t={t} />
                    </div>
                  );
                })
          )}

          {tab === "favorites" && (
            favoriteMalls.length === 0
              ? <EmptyState icon="❤️" message={t.noFavorites} />
              : favoriteMalls.map(f => {
                  const mall = f.malls as { id: string; name: string; icon: string; dist_km: number; store_count: string } | null;
                  return (
                    <div key={f.id} className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div className="mallIcon">{mall?.icon ?? "🏢"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{mall?.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          📍 {mall?.dist_km} {t.away} · {mall?.store_count} {t.stores}
                        </div>
                      </div>
                      <button
                        className="btn btnDanger btnSm"
                        disabled={togglingId === f.mall_id}
                        onClick={() => handleRemoveFavorite(f.mall_id)}
                      >
                        {t.removeFavorite}
                      </button>
                    </div>
                  );
                })
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 24px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p className="muted" style={{ fontSize: 15 }}>{message}</p>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: Translations }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: t.completed,   color: "var(--success)",  bg: "var(--success-dim)" },
    cancelled: { label: t.cancelled,   color: "var(--muted)",    bg: "rgba(255,255,255,0.05)" },
    active:    { label: t.active,      color: "var(--red)",      bg: "var(--red-dim)" },
    expired:   { label: t.expired,     color: "var(--muted2)",   bg: "rgba(255,255,255,0.04)" },
    waiting:   { label: t.queueWaiting.replace("…",""), color: "var(--red)",     bg: "var(--red-dim)" },
    ready:     { label: t.queueReady.replace(" 🎉",""),  color: "var(--success)", bg: "var(--success-dim)" },
  };
  const cfg = map[status] ?? map["cancelled"];
  return (
    <span style={{
      padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      color: cfg.color, background: cfg.bg, flexShrink: 0,
    }}>
      {cfg.label}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
