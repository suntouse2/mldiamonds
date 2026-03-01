import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ToasterWrapper from "./ui/ToasterWrapper";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  preload: true,
});

export const metadata: Metadata = {
  title: "MLDiamonds — Магазин доната Mobile Legends",
  description: "Mobile Legends донат алмазы дешево и быстро",
};
export const viewport: Viewport = {
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${montserrat.variable}`}>
      <body className="antialiased">
        <ToasterWrapper />
        {children}
        <div id="portal-root"></div>
      </body>
    </html>
  );
}
