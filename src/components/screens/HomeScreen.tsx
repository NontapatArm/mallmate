"use client";
import { useState } from "react";
import type { ScreenProps } from "@/lib/types";
import { MALLS } from "@/lib/data";
import LangToggle from "@/components/LangToggle";
import TabBar from "@/components/TabBar";

export default function HomeScreen({ t, lang, setLang, go }: ScreenProps) {
  const [search, setSearch] = useState("");
  const filtered = MALLS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

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

      <div className="spacer" />
      <TabBar active="home" t={t} go={go} />
    </div>
  );
}
