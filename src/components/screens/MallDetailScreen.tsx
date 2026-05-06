"use client";
import { useEffect, useState } from "react";
import type { ScreenProps, Store } from "@/lib/types";
import { MALLS } from "@/lib/data";
import { fetchStores } from "@/lib/supabase";
import LangToggle from "@/components/LangToggle";

type StoreTab = "restaurants" | "services" | "shopping";
const TAB_TYPE: Record<StoreTab, Store["type"]> = {
  restaurants: "restaurant",
  services:    "services",
  shopping:    "shopping",
};

export default function MallDetailScreen({ t, lang, setLang, go, state }: ScreenProps) {
  const mall = state?.mall ?? MALLS[0];
  const [tab,     setTab]     = useState<StoreTab>("restaurants");
  const [stores,  setStores]  = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores(String(mall.id))
      .then(setStores)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mall.id]);

  const shown = stores.filter(s => s.type === TAB_TYPE[tab]);

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />

      <div className="navBar">
        <button className="navBack" onClick={() => go("home", null, true)}>←</button>
        <span className="screenTitle">{mall.name}</span>
        <div className="navSpacer" />
      </div>

      <div className="mapPh" style={{ height: 160 }}>
        <span className="mapPhIcon">🗺️</span>
        <span>{t.floorMap}</span>
      </div>

      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 16 }}>
        {mall.cnt} {t.stores} · {mall.dist} {t.away}
      </p>

      <div className="row" style={{ marginBottom: 16 }}>
        {(["restaurants","services","shopping"] as StoreTab[]).map(k => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              background: tab === k ? "var(--red)" : "#1a1a1a",
              color:      tab === k ? "#fff"       : "var(--muted)",
              transition: "all 0.15s",
            }}
          >
            {t[k]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="stack">
          {shown.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center", padding: 24 }}>
              No {tab} found
            </p>
          )}
          {shown.map(s => (
            <div key={s.id} className="storeItem" onClick={() => s.wait > 0 ? go("reserve", { mall, store: s }) : undefined}>
              <div className="storeIcon">{s.icon}</div>
              <div className="storeDetail">
                <h4>{s.name}</h4>
                <p>{t.level} {s.floor}{s.wait > 0 ? ` · ~${s.wait} ${t.minutes}` : ""}</p>
              </div>
              {s.wait > 0 && (
                <button
                  className="storeAction"
                  onClick={e => { e.stopPropagation(); go("reserve", { mall, store: s }); }}
                >
                  {t.queueReserve}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="spacer" />
      <div className="row" style={{ marginTop: 16 }}>
        <button
          className="btn btnPrimary"
          style={{ flex: 1 }}
          onClick={() => { if (stores[0]) go("reserve", { mall, store: stores[0] }); }}
          disabled={stores.length === 0}
        >
          {t.queueReserve}
        </button>
        <button className="btn btnGhost" style={{ flex: 1 }} onClick={() => go("parking", { mall })}>
          {t.saveParking}
        </button>
      </div>
    </div>
  );
}
