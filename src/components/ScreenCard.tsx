"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import DemoSite from "./DemoSite";
import { markReturnFromProject } from "@/lib/return-nav";

/**
 * Card 2 — un monitor (Studio Display) il cui schermo ospiterà un componente
 * "sito" leggero e custom. Lo sfondo `hero1-j5-bg.webp` mostra il monitor con lo
 * schermo spento (scuro). Il box `.screen` è posizionato con le coordinate
 * ufficiali del vettoriale, dentro uno "stage" scalato a cover (via container
 * query units): così resta incollato al monitor a qualsiasi risoluzione, senza
 * JS. A schermo spento `.screen` è a opacity 0 → si vede lo schermo scuro del
 * jpg sotto. Quando la card entra a fuoco (`active`) parte il power-on LCD che
 * rivela il contenuto; uscendo, un breve power-off e reset.
 */
export default function ScreenCard({ active }: { active: boolean }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const captionNameRef = useRef<HTMLSpanElement>(null);
  const captionLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    tlRef.current?.kill();

    // Stato "spento" a cui lo schermo torna sempre, pronto per un nuovo power-on.
    const OFF = { opacity: 0, filter: "brightness(1.8)", scale: 1.02 };

    if (!active) {
      // Se era acceso, breve power-off (fade rapido con calo di
      // retroilluminazione), poi reset a spento. Se era già spento reset immediato.
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

    // Power-on LCD: micro-flicker di opacity, poi bloom di luminosità e
    // assestamento di scala.
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.set(screen, OFF);
    tl.to(screen, { opacity: 0.4, duration: 0.06, ease: "power1.out" })
      .to(screen, { opacity: 0.1, duration: 0.05, ease: "power1.in" })
      .to(screen, { opacity: 1, duration: 0.14, ease: "power1.out" });
    tl.to(screen, { filter: "brightness(1)", duration: 0.6, ease: "power2.out" }, "-=0.1")
      .to(screen, { scale: 1, duration: 0.6, ease: "power2.out" }, "<");

    return () => {
      tl.kill();
    };
  }, [active]);

  // Caption in basso che "nomina" il progetto mostrato nel monitor: reveal
  // per-parola mascherato (stesso trucco dell'hero via SplitText) quando la card
  // entra a fuoco, con il link "Visit demo" che compare subito dopo. Da card non
  // attiva resta nascosta, così l'intro si rigioca a ogni rientro (come il
  // power-on dello schermo).
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
    <div className="screen-card">
      <div className="screen-card__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="screen-card__bg"
          src="/hero/hero1-j5-bg.webp"
          alt="Postazione con Studio Display"
          draggable={false}
        />
        <div className="screen-card__screen" ref={screenRef} aria-hidden="true">
          <DemoSite active={active} />
        </div>
      </div>

      <p className="screen-card__caption">
        <span className="screen-card__caption-name" ref={captionNameRef}>
          GiGi — Modern e-commerce template
        </span>
        <Link
          href="/projects/gigi"
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
