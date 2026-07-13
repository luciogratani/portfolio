"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import SfccDemoSite from "./sfcc/SfccDemoSite";
import { markReturnFromProject } from "@/lib/return-nav";
import { rectToQuadMatrix3d, type Point } from "@/lib/homography";

/**
 * Card 3 — monitor Apple Studio Display ripreso IN PROSPETTIVA (schermo
 * obliquo, non un rettangolo dritto come in ScreenCard/card 2). Lo sfondo
 * `hero2-j5-bg.jpg` mostra il monitor spento e angolato.
 *
 * Il mini-sito SFCC (SfccDemoSite) è progettato in un rettangolo dritto
 * 1600×900 (16:9, come lo Studio Display). Per "incollarlo" al quadrilatero
 * prospettico dello schermo nella foto usiamo un'omografia (vedi
 * src/lib/homography.ts): la `.screen` ha dimensione intrinseca fissa
 * 1600×900 e riceve un `transform: matrix3d(...)` calcolato in JS che la
 * deforma esattamente sul quad. Il quad è definito come 4 frazioni (0..1)
 * della bg, estratte dal vettoriale originale (TL, TR, BR, BL) e va
 * ricalcolato a ogni resize dello stage (ResizeObserver), perché è statico
 * nello spazio-stage ma lo stage cambia dimensione in px.
 *
 * IMPORTANTE: GSAP anima SOLO opacity/filter sulla `.screen` (power-on LCD,
 * niente scale): il transform è di esclusiva proprietà del calcolo
 * dell'omografia, e non va mai sovrascritto da un tween che tocchi
 * transform/scale, o la prospettiva si rompe.
 */

// Frazioni (0..1) dei 4 angoli dello schermo rispetto alla bg, ordine
// TL, TR, BR, BL — estratte e verificate dal vettoriale originale di hero2.
const SCREEN_QUAD_FRACTIONS: [Point, Point, Point, Point] = [
  [0.24439, 0.15771],
  [0.71379, 0.3499],
  [0.75818, 0.74698],
  [0.27706, 0.57984],
];

const DESIGN_W = 1600;
const DESIGN_H = 900;

export default function SfccScreenCard({ active }: { active: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const captionNameRef = useRef<HTMLSpanElement>(null);
  const captionLinkRef = useRef<HTMLAnchorElement>(null);

  // Calcolo dell'omografia rettangolo(1600x900) -> quad prospettico, in px
  // reali dello stage. Ricalcolato a ogni resize (ResizeObserver): il quad è
  // fisso in frazioni di stage, ma le sue coordinate px cambiano col layout.
  useEffect(() => {
    const stage = stageRef.current;
    const screen = screenRef.current;
    if (!stage || !screen) return;

    const updateWarp = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (w === 0 || h === 0) return;

      const dest: [Point, Point, Point, Point] = SCREEN_QUAD_FRACTIONS.map(
        ([fx, fy]) => [fx * w, fy * h],
      ) as [Point, Point, Point, Point];

      screen.style.transform = rectToQuadMatrix3d(DESIGN_W, DESIGN_H, dest);
    };

    updateWarp();

    const ro = new ResizeObserver(updateWarp);
    ro.observe(stage);

    return () => ro.disconnect();
  }, []);

  // Power-on LCD: identico a ScreenCard (card 2) ma SENZA scale (né in OFF né
  // in accensione): anima solo opacity + filter, perché il transform della
  // `.screen` è occupato dalla matrix3d dell'omografia.
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    tlRef.current?.kill();

    const OFF = { opacity: 0, filter: "brightness(1.8)" };

    if (!active) {
      if (Number(gsap.getProperty(screen, "opacity")) < 0.01) {
        gsap.set(screen, OFF);
        return;
      }
      const off = gsap.timeline({ onComplete: () => gsap.set(screen, OFF) });
      tlRef.current = off;
      off.to(screen, {
        opacity: 0,
        filter: "brightness(0.6)",
        duration: 0.2,
        ease: "power2.in",
      });
      return () => {
        off.kill();
      };
    }

    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.set(screen, OFF);
    tl.to(screen, { opacity: 0.4, duration: 0.06, ease: "power1.out" })
      .to(screen, { opacity: 0.1, duration: 0.05, ease: "power1.in" })
      .to(screen, { opacity: 1, duration: 0.14, ease: "power1.out" });
    tl.to(
      screen,
      { filter: "brightness(1)", duration: 0.6, ease: "power2.out" },
      "-=0.1",
    );

    return () => {
      tl.kill();
    };
  }, [active]);

  // Caption in basso, stesso pattern di ScreenCard: reveal per-parola
  // mascherato via SplitText quando `active`, reset a card non attiva.
  useEffect(() => {
    const name = captionNameRef.current;
    const link = captionLinkRef.current;
    if (!name || !link) return;

    gsap.registerPlugin(SplitText);

    if (!active) {
      gsap.set([name, link], { opacity: 0 });
      return;
    }

    const split = new SplitText(name, { type: "words", mask: "words" });
    gsap.set(name, { opacity: 1 });
    gsap.set(split.words, { yPercent: 110 });
    gsap.set(link, { opacity: 0, y: 12 });

    const tl = gsap.timeline({ delay: 0.25 });
    tl.to(split.words, {
      yPercent: 0,
      stagger: 0.06,
      ease: "expo.out",
      duration: 0.7,
    }).to(
      link,
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      "-=0.25",
    );

    return () => {
      tl.kill();
      split.revert();
    };
  }, [active]);

  return (
    <div className="sfcc-screen-card">
      <div className="sfcc-screen-card__stage" ref={stageRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="sfcc-screen-card__bg"
          src="/hero/hero2-j5-bg.jpg"
          alt="Studio Display angolato con schermo spento"
          draggable={false}
        />
        <div className="sfcc-screen-card__screen" ref={screenRef} aria-hidden="true">
          <SfccDemoSite active={active} />
        </div>
      </div>

      <p className="screen-card__caption">
        <span className="screen-card__caption-name" ref={captionNameRef}>
          SFCC — E-commerce arredamento
        </span>
        <Link
          href="/projects/sfcc"
          onClick={markReturnFromProject}
          className="screen-card__caption-link"
          ref={captionLinkRef}
        >
          Visit demo
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </p>
    </div>
  );
}
