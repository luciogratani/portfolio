import type { Metadata } from "next";
import { demoSans, demoMono } from "@/fonts/demo-site-fonts";
import { LenisProvider } from "@/components/gigi/lenis-provider";
import ClickSpark from "@/components/gigi/click-spark";
import "./gigi.css";

// Layout della route /projects/gigi: qui vive l'esperienza "vera" della landing
// GiGi che il monitor della card 2 anticipa. Isolato dal portfolio:
// - LenisProvider (smooth scroll) dirotta lo scroll del documento, quindi DEVE
//   stare solo su questa route e non su "/" (che ha la sua gestione scroll).
// - i font Inter/JetBrains sono riusati da demo-site-fonts.ts (stesse variabili
//   del monitor: nessun secondo download).
// - ClickSpark aggiunge la scintilla lime al click, come nell'originale.
export const metadata: Metadata = {
  title: "GiGi Energy Drink | Dream Big, Drink GiGi",
  description:
    "Zero sugar, 75mg caffeine, 100% natural flavors. The energy drink for dreamers and doers.",
};

export default function GigiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`gigi-root antialiased ${demoSans.variable} ${demoMono.variable}`}>
      <ClickSpark
        sparkColor="#AFFF00"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
        easing="ease-out"
      >
        <LenisProvider>{children}</LenisProvider>
      </ClickSpark>
    </div>
  );
}
