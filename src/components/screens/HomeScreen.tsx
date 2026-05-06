"use client";
import { useEffect, useState } from "react";
import type { ScreenProps } from "@/lib/types";
import type { Mall } from "@/lib/types";
import { fetchMalls } from "@/lib/supabase";
import LangToggle from "@/components/LangToggle";
import TabBar from "@/components/TabBar";

export default function HomeScreen({ t, lang, setLang, go }: ScreenProps) {
  const [search,  setSearch]  = useState("");
  const [malls,   setMalls]   = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMalls()
      .then(setMalls)
      .catch(() => {/* fallback to empty */})
      .finally(() => setLoading(false));
  }, []);

  const filtered = malls.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="screen">
      <LangToggle lang={lang} setLang={setLang} />

      <div style={{ paddingTop: 8, marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{t.locLabel}</p>
        <h2 style={{ fontSize: 26, fontWeight: 700 }}>{t.city}</h2>
      </div>

      <div className="searchBar">
        <span style={{ color: "var(--muted)" }}>🔍</span>
        <input
          placeholder={t.searchPh}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <div className="spinner" />
        </div>
      ) : (
        <div className="stack">
          {filtered.map(m => (
            <div
              key={m.id}
              className={`mallCard ${m.featured ? "mallCardFeatured" : ""}`}
              onClick={() => go("mall-detail", { mall: m })}
            >
              <div className="mallIcon">{m.icon}</div>
              <div className="mallInfo">
                <h3>{m.name}</h3>
                <p>📍 {m.dist} {t.away}</p>
                <p>{m.cnt} {t.stores}</p>
                {m.featured && <span className="badge">{t.featured}</span>}
              </div>
              <span className="settingsArrow" style={{ marginLeft: "auto", alignSelf: "center" }}>›</span>
            </div>
          ))}
        </div>
      )}

      <div className="spacer" />
      <TabBar active="home" t={t} go={go} />
    </div>
  );
}
