"use client";
import { useEffect, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { supabase, getMyReservations, cancelReservation } from "@/lib/supabase";

interface Reservation {
  id: string;
  party_size: number;
  estimated_wait: number;
  status: string;
  created_at: string;
  stores: { name: string; icon: string } | null;
  malls:  { name: string } | null;
}

export default function ReservedScreen({ t, go, state }: ScreenProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [expanded,     setExpanded]     = useState<string | null>(state?.reservationId ?? null);
  const [statuses,     setStatuses]     = useState<Record<string, string>>({});
  const [cancelling,   setCancelling]   = useState<Set<string>>(new Set());

  // Load all active reservations
  useEffect(() => {
    getMyReservations()
      .then(data => {
        const list = data as Reservation[];
        setReservations(list);
        const init: Record<string, string> = {};
        list.forEach(r => { init[r.id] = r.status; });
        setStatuses(init);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Realtime: listen for status changes on all active reservations
  useEffect(() => {
    if (reservations.length === 0) return;

    const channel = supabase
      .channel("my-reservations-watch")
      .on("postgres_changes", {
        event:  "UPDATE",
        schema: "public",
        table:  "queue_reservations",
      }, (payload) => {
        const updated = payload.new as { id: string; status: string };
        setStatuses(prev => ({ ...prev, [updated.id]: updated.status }));
        if (updated.status === "ready") {
          setExpanded(updated.id);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [reservations.length]);

  async function handleCancel(id: string, storeName: string) {
    if (!window.confirm(`${t.cancelConfirm}\n"${storeName}"`)) return;
    setCancelling(prev => new Set(prev).add(id));
    try {
      await cancelReservation(id);
      setReservations(prev => prev.filter(r => r.id !== id));
      setStatuses(prev => { const n = { ...prev }; delete n[id]; return n; });
      if (expanded === id) setExpanded(null);
    } catch { /* silent — keep card */ }
    finally { setCancelling(prev => { const n = new Set(prev); n.delete(id); return n; }); }
  }

  if (loading) {
    return (
      <div className="pageContent" style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="pageContent pageContentNarrow" style={{ margin: "0 auto", paddingTop: 60, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎟️</div>
        <h2 style={{ marginBottom: 8 }}>{t.queueConfirmed.replace("!", "")}</h2>
        <p className="muted" style={{ marginBottom: 32 }}>{t.queueNote}</p>
        <button className="btn btnPrimary btnFull" onClick={() => go("home")}>{t.explore}</button>
      </div>
    );
  }

  return (
    <div className="pageContent" style={{ maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div className="checkCircle checkRed" style={{ margin: "0 auto 12px" }}>🎟️</div>
        <h1 className="pageTitle" style={{ marginBottom: 4 }}>{t.queueConfirmed}</h1>
        <p className="muted" style={{ fontSize: 14 }}>{t.queueNote}</p>
      </div>

      {/* Reservation cards */}
      <div className="stack">
        {reservations.map((r, idx) => {
          const status    = statuses[r.id] ?? r.status;
          const isReady   = status === "ready";
          const isOpen    = expanded === r.id;
          const storeName = r.stores?.name ?? "—";
          const storeIcon = r.stores?.icon ?? "🏪";
          const mallName  = r.malls?.name  ?? "—";

          return (
            <div key={r.id} style={{
              border: `1px solid ${isReady ? "rgba(34,197,94,0.4)" : "var(--border)"}`,
              borderRadius: 16,
              background: isReady ? "rgba(34,197,94,0.06)" : "var(--surface)",
              overflow: "hidden",
              transition: "border-color 0.3s",
            }}>
              {/* Card header — always visible */}
              <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                {/* Store icon */}
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: "var(--red-dim)", fontSize: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>{storeIcon}</div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{storeName}</div>
                  <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>{mallName}</div>
                  {/* Status badge */}
                  {isReady ? (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "var(--success)",
                      background: "var(--success-dim)", borderRadius: 20,
                      padding: "2px 10px",
                    }}>● {t.queueReady.replace(" 🎉", "")}</span>
                  ) : (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 11, fontWeight: 600, color: "var(--muted)",
                    }}>
                      <div className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
                      {t.queueWaiting}
                    </span>
                  )}
                </div>

                {/* Wait time pill */}
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: isReady ? "var(--success)" : "var(--red)", lineHeight: 1 }}>
                    {isReady ? "✓" : r.estimated_wait}
                  </div>
                  {!isReady && <div className="muted" style={{ fontSize: 10, marginTop: 2 }}>{t.minutes}</div>}
                </div>
              </div>

              {/* Expand button */}
              <button
                onClick={() => setExpanded(isOpen ? null : r.id)}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "none", borderTop: "1px solid var(--border)",
                  color: "var(--muted)", fontSize: 12, fontWeight: 600,
                  padding: "10px", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "background 0.15s",
                }}
              >
                {isOpen ? `▲ ซ่อน` : `▼ ดูรายละเอียด`}
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{
                  padding: "16px 18px 18px",
                  borderTop: "1px solid var(--border)",
                  background: "rgba(0,0,0,0.2)",
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                }}>
                  {[
                    { label: t.partySize,  value: `${r.party_size} คน` },
                    { label: t.yourTurnIn, value: `~${r.estimated_wait} ${t.minutes}` },
                    { label: "ห้าง",        value: mallName },
                    { label: "สถานะ",       value: isReady ? "✅ พร้อมแล้ว" : "⏳ รอคิว" },
                  ].map(d => (
                    <div key={d.label} style={{
                      background: "var(--surface)", borderRadius: 10,
                      padding: "10px 12px",
                    }}>
                      <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>{d.label}</div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{d.value}</div>
                    </div>
                  ))}

                  {/* Ready CTA */}
                  {isReady && (
                    <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                      <div style={{
                        background: "var(--success-dim)", border: "1px solid rgba(34,197,94,0.3)",
                        borderRadius: 12, padding: "12px 16px", textAlign: "center",
                        color: "var(--success)", fontWeight: 700, fontSize: 15,
                      }}>
                        🎉 {t.queueReady}
                      </div>
                    </div>
                  )}

                  {/* Cancel button */}
                  {!isReady && (
                    <div style={{ gridColumn: "1 / -1", marginTop: 4 }}>
                      <button
                        className="btn btnDanger btnFull btnSm"
                        disabled={cancelling.has(r.id)}
                        onClick={() => handleCancel(r.id, storeName)}
                        style={{ justifyContent: "center" }}
                      >
                        {cancelling.has(r.id) ? "⏳ กำลังยกเลิก…" : `✕ ${t.cancelQueue}`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Order number indicator */}
      <p className="muted" style={{ textAlign: "center", fontSize: 12, marginTop: 16 }}>
        {reservations.length} {reservations.length === 1 ? "คิวที่จองอยู่" : "คิวที่จองอยู่"}
      </p>

      {/* Actions */}
      <div className="stack" style={{ marginTop: 16 }}>
        <button className="btn btnPrimary btnFull" onClick={() => go("home")}>{t.explore}</button>
      </div>
    </div>
  );
}
