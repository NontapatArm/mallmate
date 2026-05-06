"use client";
import { useEffect } from "react";
import type { ScreenProps } from "@/lib/types";
import LangToggle from "@/components/LangToggle";

export default function PhoneLoadingScreen({ t, lang, setLang, go, state }: ScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => go("code", state), 1800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen screenCenter">
      <LangToggle lang={lang} setLang={setLang} />
      <div className="spinner" style={{ marginBottom: 24 }} />
      <p className="subtitle">{t.verifying}</p>
    </div>
  );
}
