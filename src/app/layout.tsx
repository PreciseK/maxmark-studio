import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import "./globals.css";

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
  title: "Maxmark Studio — AI-Native Production Studio",
  description:
    "An AI-Native Production Studio. Cinematic Craft at African Market Speed. Brand films, narratives, and music visuals for brands and artists across Africa and emerging markets.",
  openGraph: {
    title: "Maxmark Studio",
    description: "Cinematic Craft at African Market Speed.",
    siteName: "Maxmark Studio",
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
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable}`}
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <body style={{ backgroundColor: "var(--bg-base)", color: "var(--fg-primary)" }}>
        <SmoothScrollProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </SmoothScrollProvider>
        {process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" && <Analytics />}
      </body>
    </html>
  );
}
