// File di definizione font (pattern documentato in
// node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md
// § "Using a font definitions file"): tiene le chiamate a next/font/google
// fuori dal modulo "use client" di DemoSite, così i font restano scoped al
// componente (variabili CSS) invece di finire nel bundle globale.
import { Inter, JetBrains_Mono } from "next/font/google";

export const demoSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-demo-sans",
  display: "swap",
});

export const demoMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-demo-mono",
  display: "swap",
});
