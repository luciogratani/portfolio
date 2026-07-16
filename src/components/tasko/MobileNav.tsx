"use client";

// Versione semplificata di components/dashboard/mobile-nav.tsx: il template
// usa <Sheet> (radix-ui/react-dialog) per il drawer mobile. Qui evitiamo la
// dipendenza in piu' (il brief la richiede solo se si tiene lo sheet) e
// replichiamo lo stesso drawer con uno stato locale + overlay/transform
// Tailwind: stesso risultato visivo, nessun pacchetto aggiuntivo.
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/tasko/ui/button";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden hover:bg-tasko-secondary transition-all duration-300"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-6 h-6" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Overlay + drawer: montati sempre, animati via opacity/transform cosi'
          l'uscita resta fluida (niente unmount istantaneo). */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative h-full">
          <Sidebar />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-[-2.75rem] w-9 h-9 rounded-full bg-tasko-card border border-tasko-border flex items-center justify-center text-tasko-foreground"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
