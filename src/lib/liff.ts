import type Liff from "@line/liff";

export interface LineProfile {
  userId:      string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

let liffInstance: typeof Liff | null = null;
let initPromise:  Promise<void> | null = null;

export async function initLiff(): Promise<typeof Liff> {
  if (typeof window === "undefined") throw new Error("LIFF runs client-side only");

  if (!liffInstance) {
    const mod = await import("@line/liff");
    liffInstance = mod.default;
  }

  if (!initPromise) {
    initPromise = liffInstance.init({
      liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
    });
  }

  await initPromise;
  return liffInstance;
}

export async function getLiff() {
  return initLiff();
}

export async function isLoggedIn(): Promise<boolean> {
  const liff = await initLiff();
  return liff.isLoggedIn();
}

export async function login() {
  const liff = await initLiff();
  if (!liff.isLoggedIn()) {
    liff.login({ redirectUri: window.location.href });
  }
}

export async function logout() {
  const liff = await initLiff();
  liff.logout();
}

export async function getLineProfile(): Promise<LineProfile | null> {
  try {
    const liff = await initLiff();
    if (!liff.isLoggedIn()) return null;
    const p = await liff.getProfile();
    return {
      userId:        p.userId,
      displayName:   p.displayName,
      pictureUrl:    p.pictureUrl,
      statusMessage: p.statusMessage,
    };
  } catch {
    return null;
  }
}

export function isInLineApp(): boolean {
  if (typeof window === "undefined") return false;
  return /Line/i.test(navigator.userAgent);
}
