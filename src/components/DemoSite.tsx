"use client";

// La lattina è un <img> nativo (non next/image): il componente vive dentro un
// box scalato via CSS transform (vedi demo-site.css), dove next/image
// interferirebbe col proprio sistema di sizing/layout.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { demoSans, demoMono } from "@/fonts/demo-site-fonts";

// Larghezza di design del layout fisso (vedi demo-site.css): serve per
// calcolare lo scale factor in JS.
const DESIGN_W = 1600;

/**
 * DemoSite — ricostruzione leggera e "congelata" (nessuno scroll interno)
 * dell'hero + nav di riferimento (GiGi energy drink), pensata per vivere
 * dentro lo schermo del monitor di ScreenCard. Layout desktop FISSO a
 * 1920×1080: niente breakpoint responsive, perché l'intero blocco viene
 * scalato via `transform: scale()` in base alla larghezza del box schermo
 * (.screen-card__screen), con lo scale factor calcolato in JS (vedi
 * useEffect con ResizeObserver più sotto) e non al viewport reale.
 *
 * Tutto ciò che nel riferimento era scroll-linked (parallasse su testo,
 * lattina, opacity dell'hero) è stato rimosso: qui non c'è scroll. I loop
 * infiniti (badge dot, glow del logo/CTA, blob, lattina che fluttua, mouse
 * indicator) restano e sono pure CSS (vedi demo-site.css). L'ingresso del
 * contenuto è invece un piccolo timeline GSAP guidato dalla prop `active`
 * (si attiva quando ScreenCard fa il power-on dello schermo).
 */
export default function DemoSite({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const canWrapRef = useRef<HTMLDivElement>(null);

  // `scale()` accetta solo un numero unitless: non è possibile ricavarlo in
  // CSS puro da un'unità container-query (es. `100cqw / 1920` è una lunghezza,
  // non un numero, quindi `scale(calc(...))` verrebbe scartato come invalido).
  // Calcoliamo quindi lo scale factor in JS, osservando il resize del box
  // schermo (.screen-card__screen) e scrivendolo come custom property.
  useEffect(() => {
    const root = rootRef.current;
    const parent = root?.parentElement;
    if (!root || !parent) return;

    const updateScale = () => {
      root.style.setProperty("--demo-scale", String(parent.clientWidth / DESIGN_W));
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(parent);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const targets = [
        badgeRef.current,
        line1Ref.current,
        line2Ref.current,
        subtitleRef.current,
        ctaRowRef.current,
        benefitsRef.current,
        canRef.current,
      ].filter((el): el is HTMLElement => el !== null);

      if (!active) {
        // Stato nascosto pronto per il prossimo ingresso (il monitor si
        // spegne e riaccende: l'animazione deve poter ripartire da capo).
        gsap.set(targets, { opacity: 0, y: 40 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 40 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });
    }, root);

    return () => ctx.revert();
  }, [active]);

  // Interazione col puntatore, attiva solo a schermo acceso (`active`):
  // - Parallasse: la lattina (foreground, canWrapRef) segue il puntatore,
  //   la colonna di testo (textColRef) si muove in direzione opposta, così
  //   da accentuare la profondità tra i due piani.
  // - Scala di prossimità: più il puntatore è vicino al centro della
  //   lattina più questa si ingrandisce (1.05 a distanza 0, 0.98 alla
  //   distanza massima possibile dentro il root, cioè l'angolo più lontano).
  // - Le animazioni CSS ambientali della lattina (float + glow, sempre
  //   attive) vengono messe in pausa mentre il puntatore si muove (classe
  //   `is-pointer-active` sul root, vedi demo-site.css) e riprendono dopo
  //   1s di inattività, per evitare che si sommino ai tween GSAP del
  //   parallasse/scala generando jitter.
  // Animiamo canWrapRef (il div "relative" che avvolge glow + canRef) e non
  // canRef direttamente, perché canRef ha già una propria transform via CSS
  // (.demo-can-float): animare lo stesso elemento con GSAP creerebbe un
  // conflitto tra le due transform.
  useEffect(() => {
    if (!active) return;

    const root = rootRef.current;
    const canWrap = canWrapRef.current;
    const textCol = textColRef.current;
    if (!root || !canWrap || !textCol) return;

    const canX = gsap.quickTo(canWrap, "x", { duration: 0.5, ease: "power3" });
    const canY = gsap.quickTo(canWrap, "y", { duration: 0.5, ease: "power3" });
    const canScale = gsap.quickTo(canWrap, "scale", {
      duration: 0.5,
      ease: "power3",
    });
    const textX = gsap.quickTo(textCol, "x", { duration: 0.6, ease: "power3" });
    const textY = gsap.quickTo(textCol, "y", { duration: 0.6, ease: "power3" });

    // Valori in px di design: vengono rimpiccioliti dal transform: scale()
    // del root (--demo-scale), quindi restano proporzionati a schermo.
    const CAN_SHIFT = 26;
    const TEXT_SHIFT = 14;

    let idleTimer: ReturnType<typeof setTimeout>;

    const onMove = (e: MouseEvent) => {
      // Mette in pausa float/glow della lattina e riavvia il timer di 1s
      // che li riattiva al fermo del puntatore.
      root.classList.add("is-pointer-active");
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => root.classList.remove("is-pointer-active"), 1000);

      // Parallasse: posizione normalizzata del puntatore rispetto al centro
      // del root, clampata a [-1, 1].
      const r = root.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)));
      canX(nx * CAN_SHIFT);
      canY(ny * CAN_SHIFT);
      textX(nx * -TEXT_SHIFT); // opposta, effetto profondità
      textY(ny * -TEXT_SHIFT);

      // Scala di prossimità: più il puntatore è vicino al centro della
      // lattina, più questa si ingrandisce (1.05 → 0.98).
      const cr = canWrap.getBoundingClientRect();
      const ccx = cr.left + cr.width / 2;
      const ccy = cr.top + cr.height / 2;
      const dist = Math.hypot(e.clientX - ccx, e.clientY - ccy);
      // Dmax = distanza dal centro lattina all'angolo più lontano del root
      const corners = [
        [r.left, r.top],
        [r.right, r.top],
        [r.left, r.bottom],
        [r.right, r.bottom],
      ];
      const dmax = Math.max(...corners.map(([px, py]) => Math.hypot(px - ccx, py - ccy)));
      const t = Math.max(0, Math.min(1, dist / dmax));
      canScale(1.05 - 0.07 * t);
    };

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(idleTimer);
      root.classList.remove("is-pointer-active");
      gsap.killTweensOf([canWrap, textCol]);
      gsap.set(canWrap, { x: 0, y: 0, scale: 1 });
      gsap.set(textCol, { x: 0, y: 0 });
    };
  }, [active]);

  return (
    <div
      ref={rootRef}
      className={`demo-site ${demoSans.variable} ${demoMono.variable}`}
    >
      {/* Sfondo: bianco + gradiente lime tenue + noise + due blob sfocati */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#AFFF00]/5 to-white" />
      <div className="demo-noise absolute inset-0" />
      <div className="demo-blob-1 absolute top-20 left-10 w-24 h-24 rounded-full bg-[#AFFF00]/20 blur-3xl" />
      <div className="demo-blob-2 absolute bottom-40 right-20 w-32 h-32 rounded-full bg-[#AFFF00]/10 blur-3xl" />

      {/* Nav */}
      <nav className="relative z-20 w-full">
        <div className="max-w-[1280px] mx-auto px-12 py-10 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="demo-logo text-2xl font-black tracking-tighter">
              <span className="text-[#121212]">Gi</span>
              <span className="demo-logo-glow text-[#AFFF00]">Gi</span>
            </span>
          </a>

          <div className="flex items-center gap-8">
            {["Home", "Flavours", "Creators", "Distributors", "Careers"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className="demo-nav-link relative text-base font-medium tracking-wide text-[#121212]/80 hover:text-[#121212] hover:scale-110 active:scale-95 transition-transform"
                >
                  {item}
                  <span className="demo-nav-link__underline absolute -bottom-1 left-0 w-full h-0.5 bg-[#AFFF00] origin-left scale-x-0" />
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            className="demo-nav-cta relative overflow-hidden bg-[#AFFF00] text-[#121212] px-6 py-2.5 rounded-full font-bold text-sm tracking-wide active:scale-95"
          >
            <span className="demo-nav-cta__shine absolute inset-0" />
            <span className="relative z-10">Get 25% Off</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex items-center overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-18 w-full">
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Testo */}
            <div ref={textColRef} className="space-y-6 ml-12">
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded-full text-xs font-mono tracking-wider"
              >
                <span className="demo-badge-dot w-2 h-2 bg-[#AFFF00] rounded-full" />
                BETTER-FOR-YOU ENERGY DRINK
              </div>

              <div className="space-y-1 overflow-hidden">
                <h1 className="text-7xl font-black tracking-tighter text-[#121212] leading-[0.9]">
                  <span ref={line1Ref} className="block">
                    FUEL YOUR
                  </span>
                  <span ref={line2Ref} className="block text-[#AFFF00]">
                    AMBITION
                  </span>
                </h1>
                <p
                  ref={subtitleRef}
                  className="text-xl font-mono text-[#121212]/60 tracking-tight pt-2 max-w-md"
                >
                  Zero sugar. Natural flavors. Clean energy that hits
                  different.
                </p>
              </div>

              <div ref={ctaRowRef} className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  className="group relative overflow-hidden bg-[#AFFF00] text-[#121212] px-6 py-3 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-500 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  <span className="relative z-10">Sign Up &amp; Save 25%</span>
                  <svg
                    className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="demo-cta-outline border-2 border-[#121212] text-[#121212] px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-[0.98] hover:bg-[#121212] hover:text-white transition-[transform,background-color,color] duration-300"
                >
                  Explore Flavours
                </button>
              </div>

              <div ref={benefitsRef} className="flex flex-wrap gap-4 pt-2">
                {[
                  "Zero Sugar",
                  "75mg Caffeine",
                  "Natural Flavours",
                  "Vitamin B Rich",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 text-xs font-mono text-[#121212]/60"
                  >
                    <div className="w-1.5 h-1.5 bg-[#AFFF00] rounded-full" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            {/* Lattina */}
            <div className="relative flex justify-center">
              <div ref={canWrapRef} className="relative">
                <div className="demo-can-glow absolute inset-0 bg-[#84cc16]/30 blur-[80px] rounded-full scale-75" />
                <div ref={canRef} className="demo-can-float relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/demo/drink2.png"
                    alt="GiGi Energy Drink - Lemon Lime Flavour"
                    width={350}
                    height={525}
                    className="relative z-10 drop-shadow-2xl"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mouse scroll indicator */}
        <div className="demo-mouse-bounce absolute bottom-6 left-1/2">
          <div className="w-5 h-8 border-2 border-[#121212]/30 rounded-full flex justify-center pt-1.5">
            <div className="demo-mouse-dot w-1 h-2 bg-[#121212]/30 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
