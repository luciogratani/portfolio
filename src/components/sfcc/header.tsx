"use client";

// Adattato da components/layout/header/index.tsx. Differenza chiave: i navItems
// NON navigano (niente <Link>/route). Chiamano `setView` del view-context per
// cambiare vista restando su /projects/sfcc. Il logo riporta alla vista "home".
// L'item attivo è marcato con aria-current + stile (come pathname nel template).
import MobileMenu from "./mobile-menu";
import { cn } from "@/lib/sfcc/utils";
import { LogoSvg } from "./logo-svg";
import CartModal from "./cart-modal";
import { Collection } from "@/lib/sfcc/types";
import { SfccView, useSfccView } from "./view-context";

export const navItems: { label: string; view: SfccView }[] = [
  { label: "home", view: "home" },
  { label: "featured", view: "featured" },
  { label: "shop all", view: "shop" },
];

interface HeaderProps {
  collections: Collection[];
}

export function Header({ collections }: HeaderProps) {
  const { view, setView } = useSfccView();

  return (
    <header className="sfcc-enter-header fixed top-0 left-0 w-full p-sides grid grid-cols-3 md:grid-cols-12 md:gap-sides z-50 items-start">
      <div className="block flex-none md:hidden">
        <MobileMenu collections={collections} />
      </div>
      <button
        type="button"
        onClick={() => setView("home")}
        aria-label="Go to store home"
        className="md:col-span-2 text-left cursor-pointer"
      >
        <LogoSvg className="h-6 w-auto max-md:place-self-center md:size-full md:max-w-[400px]" />
      </button>
      <nav className="flex items-center md:col-span-10 justify-end gap-2">
        <ul className="items-center gap-5 py-0.5 px-3 bg-background/10 rounded-sm backdrop-blur-md hidden md:flex">
          {navItems.map((item) => (
            <li key={item.view}>
              <button
                type="button"
                onClick={() => setView(item.view)}
                aria-current={view === item.view ? "page" : undefined}
                className={cn(
                  "font-semibold text-base transition-colors duration-200 uppercase cursor-pointer",
                  view === item.view
                    ? "text-foreground"
                    : "text-foreground/50 hover:text-foreground/80"
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <CartModal />
      </nav>
    </header>
  );
}
