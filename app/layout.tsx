import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const display = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sotara CRM",
  description: "Sales pipeline and account tracking for Sotara",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
