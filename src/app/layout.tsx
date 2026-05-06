import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MallMate — Navigate. Park. Queue.",
  description: "Real-time indoor navigation, parking memory, and queue booking for Bangkok malls.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
