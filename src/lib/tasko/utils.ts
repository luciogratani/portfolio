import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Stesso identico helper del template (lib/utils.ts): merge di classi
// Tailwind con override "ultima vince". Tenuto scoped in lib/tasko/ (come
// lib/sfcc/utils.ts) invece che in un lib/utils.ts condiviso, cosi non
// serve verificare compatibilita con altre route.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
