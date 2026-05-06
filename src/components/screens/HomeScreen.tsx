"use client";
import { useEffect, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import type { Mall } from "@/lib/types";
import { fetchMalls } from "@/lib/supabase";

export default function HomeScreen({ t, go }: ScreenProps) {
  const [search,  setSearch]  = useState("");
  const [malls,   setMalls]   = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMalls().then(setMalls).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = malls.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="pageContent">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{t.locLabel}</p>
          <h1 className="pageTitle" style={{ marginBottom: 0 }}>{t.homeTitle}</h1>
        </div>
        <div className="searchBar" style={{ width: 300, marginBottom: 0 }}>
          <span style={{ color: "var(--muted)" }}>🔍</span>
          <input placeholder={t.searchPh} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid2">
          {filtered.map(m => (
            <div key={m.id} className={`mallCard ${m.featured ? "mallCardFeatured" : ""}`}
              onClick={() => go("mall-detail", { mall: m })}>
              <div className="mallIcon">{m.icon}</div>
              <div className="mallInfo" style={{ flex: 1 }}>
                <h3>{m.name}</h3>
                <p>📍 {m.dist} {t.away}</p>
                <p>{m.cnt} {t.stores}</p>
                {m.featured && <span className="badge">{t.featured}</span>}
              </div>
              <span className="settingsArrow">›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
