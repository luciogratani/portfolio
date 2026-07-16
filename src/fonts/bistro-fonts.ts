// File di definizione font (stesso pattern di sfcc-fonts.ts / demo-site-fonts.ts,
// documentato in node_modules/next/dist/docs/.../font.md § "Using a font
// definitions file"): tiene le chiamate a next/font/google fuori dai moduli
// "use client", così i font restano scoped (custom property) invece di finire
// nel bundle globale. Replica i 3 font della landing di riferimento
// (repo/retro-restaurant-landing-page-vibe-bistro/app/layout.tsx), che li
// caricava via <link> Google Fonts + Space_Grotesk locale: qui tutti e tre
// passano da next/font/google, niente <link> esterno.
import { Syne, Playfair_Display, Space_Grotesk } from "next/font/google";

export const bistroSyne = Syne({
  weight: ["700", "800"],
  subsets: ["latin"],
  variable: "--font-bistro-syne",
  display: "swap",
});

export const bistroPlayfair = Playfair_Display({
  weight: ["700"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-bistro-playfair",
  display: "swap",
});

export const bistroSpaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-bistro-space-grotesk",
  display: "swap",
});
