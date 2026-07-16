// Font della route Tasko (fedeli all'originale, che usa Geist su tutto il
// layout): stesso pattern isolato di sfcc-fonts.ts (file di definizione
// next/font/google dedicato, cosi i font restano scoped a `.tasko-root`
// invece di finire nel bundle globale).
import { Geist, Geist_Mono } from "next/font/google";

export const taskoGeistSans = Geist({
  variable: "--font-tasko-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const taskoGeistMono = Geist_Mono({
  variable: "--font-tasko-geist-mono",
  subsets: ["latin"],
  display: "swap",
});
