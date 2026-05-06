"use client";
import { useEffect, useState } from "react";
import type { ScreenProps, Store } from "@/lib/types";
import { MALLS } from "@/lib/data";
import { fetchStores } from "@/lib/supabase";

type StoreTab = "restaurants" | "services" | "shopping";
const TAB_TYPE: Record<StoreTab, Store["type"]> = { restaurants: "restaurant", services: "services", shopping: "shopping" };

export default function MallDetailScreen({ t, go, state }: ScreenProps) {
  const mall = state?.mall ?? MALLS[0];
  const [tab,     setTab]     = useState<StoreTab>("restaurants");
  const [stores,  setStores]  = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores(String(mall.id)).then(setStores).catch(() => {}).finally(() => setLoading(false));
  }, [mall.id]);

  const shown = stores.filter(s => s.type === TAB_TYPE[tab]);

  return (
    <div className="pageContent">
      {/* Back + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button className="btn btnGhost btnSm" onClick={() => go("home", null, true)}>← {t.back}</button>
        <h1 className="pageTitle" style={{ marginBottom: 0 }}>{mall.name}</h1>
        <span className="muted" style={{ fontSize: 14, marginLeft: 4 }}>· {mall.dist} {t.away}</span>
      </div>

      <div className="splitLayout">
        {/* Left: Map + store list */}
        <div>
          <div className="mapPh" style={{ height: 280 }}>
            <span className="mapPhIcon">🗺️</span>
            <span>{t.floorMap}</span>
          </div>

          <div className="row mb16" style={{ flexWrap: "wrap" }}>
            <div className="tabPills">
              {(["restaurants","services","shopping"] as StoreTab[]).map(k => (
                <button key={k} className={`tabPill ${tab === k ? "tabPillActive" : ""}`} onClick={() => setTab(k)}>
                  {t[k]}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div className="spinner" /></div>
          ) : (
            <div className="stack">
              {shown.length === 0 && <p className="muted" style={{ textAlign: "center", padding: 32 }}>No {tab} found</p>}
              {shown.map(s => (
                <div key={s.id} className="storeItem" onClick={() => s.wait > 0 ? go("reserve", { mall, store: s }) : undefined}>
                  <div className="storeIcon">{s.icon}</div>
                  <div className="storeDetail">
                    <h4>{s.name}</h4>
                    <p>{t.level} {s.floor}{s.wait > 0 ? ` · ~${s.wait} ${t.minutes}` : ""}</p>
                  </div>
                  {s.wait > 0 && (
                    <button className="storeAction" onClick={e => { e.stopPropagation(); go("reserve", { mall, store: s }); }}>
                      {t.queueReserve}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Action sidebar */}
        <div className="stack" style={{ position: "sticky", top: "calc(var(--nav-h) + 24px)" }}>
          <div className="card">
            <h3 style={{ marginBottom: 4 }}>{mall.name}</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>{mall.cnt} {t.stores}</p>
            <div className="stack">
              <button className="btn btnPrimary btnFull"
                onClick={() => { if (stores[0]) go("reserve", { mall, store: stores[0] }); }}
                disabled={stores.length === 0}>
                ⏰ {t.queueReserve}
              </button>
              <button className="btn btnGhost btnFull" onClick={() => go("parking", { mall })}>
                🚗 {t.saveParking}
              </button>
            </div>
          </div>
          <div className="card" style={{ background: "rgba(255,45,85,0.06)", borderColor: "rgba(255,45,85,0.2)" }}>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Open hours</p>
            <p style={{ fontWeight: 600 }}>10:00 – 22:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
