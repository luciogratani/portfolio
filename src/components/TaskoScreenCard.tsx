"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import TaskoDemoSite from "./tasko/TaskoDemoSite";
import { markReturnFromProject } from "@/lib/return-nav";

/**
 * Card 5 — Tasko dentro un iPad Pro orizzontale (`/hero/hero4-j5-bg.png`,
 * device spento su sfondo a nido d'ape). Come ScreenCard/card 2 (GiGi): lo
 * schermo e' un rettangolo DRITTO (l'iPad e' ripreso parallelo, niente
 * matrix3d), posizionato in % dello stage sulle coordinate misurate del vetro
 * (vedi `.tasko-screen-card__screen` in sections.css). Il design fisso di
 * TaskoDemoSite (1600×1205, 4:3) sta in `.tasko-screen-card__fit` e viene
 * scalato uniformemente in JS per riempire lo schermo. La power-on (opacity/
 * filter) vive sullo screen; lo `scale` sul fit: nessun conflitto di transform.
 */
// Solo la larghezza serve al calcolo dello scale: l'altezza e' implicita
// nell'aspect 1600:1205 del box `.tasko-screen-card__screen` (che combacia con
// quello del design), quindi scalare sulla sola larghezza allinea anche in verticale.
const DESIGN_W = 1600;

export default function TaskoScreenCard({ active }: { active: boolean }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const captionNameRef = useRef<HTMLSpanElement>(null);
  const captionLinkRef = useRef<HTMLAnchorElement>(null);

  // Scala uniforme del design 1600×1205 sulla dimensione reale dello schermo
  // (rettangolo dritto: niente omografia). Ricalcolata ad ogni resize dello
  // screen box, che e' in % dello stage e cambia px col layout.
  useEffect(() => {
    const screen = screenRef.current;
    const fit = fitRef.current;
    if (!screen || !fit) return;

    const updateScale = () => {
      const w = screen.clientWidth;
      if (w === 0) return;
      fit.style.transform = `scale(${w / DESIGN_W})`;
    };

    updateScale();

    const ro = new ResizeObserver(updateScale);
    ro.observe(screen);

    return () => ro.disconnect();
  }, []);

  // Power-on: identico nelle altre ScreenCard, qui senza sfondo/foto sotto
  // (solo il frame nero), quindi il "power-off" e' semplicemente un fade.
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
    tl.to(screen, { filter: "brightness(1)", duration: 0.6, ease: "power2.out" }, "-=0.1");

    return () => {
      tl.kill();
    };
  }, [active]);

  // Caption in basso, stesso pattern delle altre ScreenCard.
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
    }).to(link, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, "-=0.25");

    return () => {
      tl.kill();
      split.revert();
    };
  }, [active]);

  return (
    <div className="tasko-screen-card">
      <div className="tasko-screen-card__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="tasko-screen-card__bg"
          src="/hero/hero4-j5-bg.png"
          alt="iPad Pro orizzontale con schermo spento"
          draggable={false}
        />
        <div className="tasko-screen-card__screen" ref={screenRef} aria-hidden="true">
          <div className="tasko-screen-card__fit" ref={fitRef}>
            <TaskoDemoSite active={active} />
          </div>
        </div>
      </div>

      <p className="screen-card__caption">
        <span className="screen-card__caption-name" ref={captionNameRef}>
          Tasko — Project management dashboard
        </span>
        <Link
          href="/projects/tasko"
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
