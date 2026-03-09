import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FROGGER — Neon Retro Arcade",
  description:
    "A neon retro Frogger game built with Next.js 16, TypeScript, and Tailwind CSS 4. " +
    "Cross the road, ride logs, fill lily pads. Three difficulty levels. Fully mobile-friendly.",
  keywords: ["frogger", "game", "retro", "neon", "arcade", "nextjs"],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "FROGGER — Neon Retro Arcade",
    description: "Cross the road and ride logs in this neon-styled arcade classic.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a14",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#0a0a14]">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a14] text-[#e0e0ff]`}>
        {children}
      </body>
    </html>
  );
}
