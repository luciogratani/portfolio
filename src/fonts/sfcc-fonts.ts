// Font della route SFCC (fedeli all'originale): Geist / Geist Mono. Definizione
// isolata (pattern next/font/google via file dedicato) per tenerli scoped alla
// route senza finire nel bundle globale.
import { Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
