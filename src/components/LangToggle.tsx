"use client";
import type { Lang } from "@/lib/types";

interface Props { lang: Lang; setLang: (l: Lang) => void; }

export default function LangToggle({ lang, setLang }: Props) {
  return (
    <div className="langRow">
      <button className={`langBtn ${lang === "th" ? "langBtnActive" : ""}`} onClick={() => setLang("th")}>TH</button>
      <button className={`langBtn ${lang === "en" ? "langBtnActive" : ""}`} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}
