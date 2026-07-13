"use client";

import { Collection } from "@/lib/sfcc/types";
import { cn } from "@/lib/sfcc/utils";
import { useSfccView } from "./view-context";

interface ShopLinksProps {
  collections: Collection[];
  align?: "left" | "right";
  label?: string;
}

// I link categoria del template puntavano a /shop/{handle} (sotto-route). Qui la
// demo resta su una sola route: cliccare una categoria porta alla vista "shop
// all" (i filtri per categoria non sono richiesti in questa fase).
export function ShopLinks({
  collections,
  label = "Shop",
  align = "left",
}: ShopLinksProps) {
  const { setView } = useSfccView();

  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <h4 className="font-extrabold text-lg md:text-xl">{label}</h4>

      <ul className="flex flex-col gap-1.5 leading-5 mt-5">
        {collections.map((item) => (
          <li key={item.handle}>
            <button
              type="button"
              onClick={() => setView("shop")}
              className={cn(
                "cursor-pointer hover:underline",
                align === "right" ? "text-right" : "text-left"
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
