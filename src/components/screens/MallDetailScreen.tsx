"use client";
import { useEffect, useState } from "react";
import type { ScreenProps, Store } from "@/lib/types";
import { MALLS } from "@/lib/data";
import { fetchStores } from "@/lib/supabase";

type StoreTab = "restaurants" | "services" | "shopping";
const TAB_TYPE: Record<StoreTab, Store["type"]> = { restaurants: "food_and_beverage", services: "services", shopping: "shopping" };

export default function MallDetailScreen({ t, lang, go, state }: ScreenProps) {
  const mall = state?.mall ?? MALLS[0];
  const [tab,     setTab]     = useState<StoreTab>("restaurants");
  const [stores,  setStores]  = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap,     setShowMap]     = useState(false);
  const [mapMode,     setMapMode]     = useState<"map" | "navigate">("map");
  const [userLat,     setUserLat]     = useState<number | null>(null);
  const [userLng,     setUserLng]     = useState<number | null>(null);
  const [locating,    setLocating]    = useState(false);
  const [travelMode,  setTravelMode]  = useState<"d" | "w" | "r">("d");

  async function handleNavigate() {
    setMapMode("navigate");
    if (userLat != null) return;
    setLocating(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
      );
      setUserLat(pos.coords.latitude);
      setUserLng(pos.coords.longitude);
    } catch { /* fallback to "My Location" string */ }
    finally { setLocating(false); }
  }

  const dest = encodeURIComponent(mall.name + " Bangkok");
  const iframeSrc = mapMode === "navigate"
    ? userLat != null && userLng != null
      ? `https://maps.google.com/maps?saddr=${userLat},${userLng}&daddr=${dest}&dirflg=${travelMode}&output=embed`
      : `https://maps.google.com/maps?saddr=My+Location&daddr=${dest}&dirflg=${travelMode}&output=embed`
    : `https://maps.google.com/maps?q=${dest}&output=embed`;

  useEffect(() => {
    fetchStores(String(mall.id)).then(setStores).catch(() => {}).finally(() => setLoading(false));
  }, [mall.id]);

  const shown = stores.filter(s => s.type === TAB_TYPE[tab]);

  return (
    <>
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
          <div className="mapPh" style={{ height: 280, cursor: "pointer" }} onClick={() => setShowMap(true)}>
            <span className="mapPhIcon">🗺️</span>
            <span>{t.floorMap}</span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
              {lang === "th" ? "กดเพื่อดูแผนที่" : "Tap to open map"}
            </span>
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
              {shown.length === 0 && <p className="muted" style={{ textAlign: "center", padding: 32 }}>No {t[tab]} found</p>}
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

    {/* Map popup modal */}
    {showMap && (
      <div className="mapModal">
        <div className="mapModalHeader">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🗺️</span>
            <span style={{ fontWeight: 700 }}>{mall.name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Tab switcher */}
            <div style={{ display: "flex", background: "var(--surface)", borderRadius: 20, padding: 3, gap: 2 }}>
              <button
                onClick={() => setMapMode("map")}
                style={{
                  padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  background: mapMode === "map" ? "var(--red)" : "transparent",
                  color: mapMode === "map" ? "#fff" : "var(--muted)",
                }}
              >
                🗺️ {t.mapView}
              </button>
              <button
                onClick={handleNavigate}
                disabled={locating}
                style={{
                  padding: "5px 12px", borderRadius: 16, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                  background: mapMode === "navigate" ? "var(--red)" : "transparent",
                  color: mapMode === "navigate" ? "#fff" : "var(--muted)",
                }}
              >
                {locating ? `📍 ${t.locating}` : `🧭 ${t.navigate}`}
              </button>
            </div>
            <button className="mapModalClose" onClick={() => { setShowMap(false); setMapMode("map"); }}>✕</button>
          </div>
        </div>

        {/* Travel mode selector — visible only in navigate mode */}
        {mapMode === "navigate" && (
          <div style={{
            display: "flex", gap: 8, padding: "10px 20px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(10,10,10,0.9)",
          }}>
            {([
              { mode: "d" as const, icon: "🚗", label: lang === "th" ? "รถยนต์" : "Drive" },
              { mode: "r" as const, icon: "🚇", label: lang === "th" ? "ขนส่ง" : "Transit" },
              { mode: "w" as const, icon: "🚶", label: lang === "th" ? "เดิน" : "Walk" },
            ]).map(item => (
              <button
                key={item.mode}
                onClick={() => setTravelMode(item.mode)}
                style={{
                  flex: 1, padding: "8px 4px", borderRadius: 10,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  transition: "all 0.15s",
                  background: travelMode === item.mode ? "var(--red-dim)" : "var(--surface)",
                  color: travelMode === item.mode ? "var(--red)" : "var(--muted)",
                  border: travelMode === item.mode ? "1px solid rgba(255,45,85,0.3)" : "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <iframe
          key={iframeSrc}
          className="mapModalFrame"
          src={iframeSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={mall.name}
        />
      </div>
    )}
    </>
  );
}
