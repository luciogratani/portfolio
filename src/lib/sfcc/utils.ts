import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Versione ridotta di lib/utils del template: solo cn + getLabelPosition (le
// altre util dipendevano da COLOR_MAP / next navigation / SDK, non servono qui).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
