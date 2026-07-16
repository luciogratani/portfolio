import type { Metadata } from "next";
import {
  bistroSyne,
  bistroPlayfair,
  bistroSpaceGrotesk,
} from "@/fonts/bistro-fonts";
import "./bistro.css";

// Layout della route /projects/bistro: qui vive l'esperienza "vera" della
// landing Vibe Bistro che il MacBook della card 4 anticipa. Isolato dal
// portfolio (route group (portfolio) non carica qui): niente scroll custom,
// solo il wrapper `.bistro-root` con le 3 CSS variable dei font (vedi
// bistro-fonts.ts + bistro.css), stesso pattern di gigi.css/sfcc.css.
export const metadata: Metadata = {
  title: "VIBE*BISTRO — No Cap, Just Flavor",
  description:
    "Serving 70s aesthetics with a modern twist. Locally sourced, highkey delicious, and strictly for the vibers.",
};

export default function BistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`bistro-root antialiased ${bistroSyne.variable} ${bistroPlayfair.variable} ${bistroSpaceGrotesk.variable}`}
    >
      <div className="bistro-root__inner">{children}</div>
    </div>
  );
}
