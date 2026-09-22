import type { Metadata } from "next";
import { Anton, Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maxmark Animations — AI-Native Animation & Film Studio",
  description:
    "An AI-Native Production Studio. Cinematic Craft at African Market Speed. Brand films, narratives, and animated visuals for brands and artists across Africa and emerging markets.",
  openGraph: {
    title: "Maxmark Animations",
    description: "Cinematic Craft at African Market Speed.",
    siteName: "Maxmark Animations",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${anton.variable} ${fraunces.variable} ${geistSans.variable} ${geistMono.variable}`}
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <body style={{ backgroundColor: "var(--bg-base)", color: "var(--fg-primary)" }}>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var p=localStorage.getItem('maxmark-theme')||'system';var t=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;document.documentElement.dataset.theme=t;document.documentElement.dataset.themePreference=p}catch(e){}})()` }} />
        {/* Global Liquid Glass SVG Filter Definitions */}
        <svg
          id="liquid-glass-filter-defs"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "fixed",
            width: 0,
            height: 0,
            pointerEvents: "none",
            inset: 0,
            zIndex: -1,
          }}
          aria-hidden="true"
        >
          <defs>
            <filter id="liquid-glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.06"
                numOctaves="3"
                seed="3"
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="8" result="blurredNoise" />
              <feColorMatrix
                in="blurredNoise"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 24 -6"
                result="alphaNoise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="alphaNoise"
                scale="22"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        {children}
        {process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && <Analytics />}
      </body>
    </html>
  );
}
