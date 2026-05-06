"use client";
import { useEffect } from "react";
import type { ScreenProps } from "@/lib/types";

export default function PhoneLoadingScreen({ t, go, state }: ScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => go("code", state), 1800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="authWrap">
      <div style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "0 auto 20px" }} />
        <p className="muted">{t.verifying}</p>
      </div>
    </div>
  );
}
