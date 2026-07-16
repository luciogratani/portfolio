import type { Metadata } from "next";
import { demoSans, demoMono } from "@/fonts/demo-site-fonts";
import "./g3-app.css";

// Layout della route /projects/g3: il gestionale/backoffice "vero" che il mock
// della card 6 (G3ScreenCard/G3DemoSite) anticipa. Isolato dal portfolio (il
// route group (portfolio) non carica qui): niente scroll a schede, solo il
// wrapper `.g3-root` con le 2 CSS variable dei font Inter/JetBrains (riusati da
// demo-site-fonts) + g3-app.css. Tema light/dark gestito in-app (data-theme sul
// root .g3-app, vedi G3App.tsx). Stesso pattern di tasko/layout.tsx.
export const metadata: Metadata = {
  title: "G3 Modena — Gestionale & backoffice",
  description:
    "Backoffice G3 Modena: dashboard, board candidati, inbox contatti, campagne e staff. Demo interattiva (dati mock, nessun backend).",
};

export default function G3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`g3-root ${demoSans.variable} ${demoMono.variable}`}>{children}</div>
  );
}
