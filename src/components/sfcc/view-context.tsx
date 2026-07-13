"use client";

// Switch delle 3 viste (home / featured / shop) SENZA cambiare route.
// Requisito: la demo resta sempre su /projects/sfcc (così, quando sarà dentro
// un mockup nella home del portfolio, "tornare indietro" è una singola route).
// I navItems dell'header e i link categoria non navigano: chiamano `setView`.
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SfccView = "home" | "featured" | "shop";

type SfccViewContextType = {
  view: SfccView;
  setView: (view: SfccView) => void;
};

const SfccViewContext = createContext<SfccViewContextType | undefined>(
  undefined
);

export function SfccViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<SfccView>("home");
  const value = useMemo(() => ({ view, setView }), [view]);
  return (
    <SfccViewContext.Provider value={value}>
      {children}
    </SfccViewContext.Provider>
  );
}

export function useSfccView() {
  const context = useContext(SfccViewContext);
  if (context === undefined) {
    throw new Error("useSfccView must be used within a SfccViewProvider");
  }
  return context;
}
