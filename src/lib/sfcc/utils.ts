import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Versione ridotta di lib/utils del template: solo cn + getLabelPosition (le
// altre util dipendevano da COLOR_MAP / next navigation / SDK, non servono qui).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usato dal CartModal per formattare i totali (carrello resta vuoto in
// questa fase, ma la utility serve comunque a compilare/mostrare 0,00).
export const formatPrice = (price: string, currencyCode: string): string => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(price));
};

export const getLabelPosition = (
  index: number,
): "top-left" | "top-right" | "bottom-left" | "bottom-right" => {
  const positions = [
    "top-left",
    "bottom-right",
    "top-right",
    "bottom-left",
  ] as const;
  return positions[index % positions.length];
};
