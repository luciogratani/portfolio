import type { Metadata } from "next";
import { geistSans, geistMono } from "@/fonts/sfcc-fonts";
import { Header } from "@/components/sfcc/header";
import { CartProvider } from "@/components/sfcc/cart-context";
import { SfccViewProvider } from "@/components/sfcc/view-context";
import { getCollections, emptyCart } from "@/lib/sfcc/data";
import "./sfcc.css";

// Layout della route /projects/sfcc: wrapper `.sfcc-root` con i font Geist,
// l'header integrale del template (logo + nav + CartModal + MobileMenu) e i due
// provider client:
// - SfccViewProvider: stato della vista attiva (home/featured/shop) — lo switch
//   avviene qui, senza cambiare route (i navItems chiamano setView).
// - CartProvider: carrello mock persistente (useReducer) inizializzato vuoto,
//   mode="live" così add-to-cart è abilitato e il CartModal non mostra il
//   messaggio "mock mode".
// Entrambi avvolgono sia l'Header (nel layout) sia il contenuto (children), così
// header e page condividono lo stesso stato.
export const metadata: Metadata = {
  title: "SFCC Store — demo",
  description:
    "Vetrina e-commerce (SFCC template) — demo con dati mock e carrello client-side.",
};

export default async function SfccLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getCollections();

  return (
    <div className={`sfcc-root ${geistSans.variable} ${geistMono.variable}`}>
      <SfccViewProvider>
        <CartProvider initialCart={emptyCart} mode="live">
          <Header collections={collections} />
          {children}
        </CartProvider>
      </SfccViewProvider>
    </div>
  );
}
