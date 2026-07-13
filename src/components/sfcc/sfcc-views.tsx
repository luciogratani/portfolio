"use client";

// Seleziona quale delle 3 viste mostrare in base allo stato client `view`,
// senza cambiare route. Le tre viste sono renderizzate lato server dalla page e
// passate come props (pattern RSC: il server compone, il client sceglie): così
// dentro ogni vista possono restare server component (es. il Footer sotto).
import type { ReactNode } from "react";
import { useSfccView } from "./view-context";

export function SfccViews({
  home,
  featured,
  shop,
}: {
  home: ReactNode;
  featured: ReactNode;
  shop: ReactNode;
}) {
  const { view } = useSfccView();
  return <>{view === "home" ? home : view === "featured" ? featured : shop}</>;
}
