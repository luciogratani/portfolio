"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import G3DemoSite from "./g3/G3DemoSite";
import { markReturnFromProject } from "@/lib/return-nav";

/**
 * Card 6 — G3 Modena (gestionale / backoffice). Riusa lo STESSO sfondo e
 * meccanismo della card 2 "GiGi" (ScreenCard): monitor Studio Display frontale
 * (`hero1-j5-bg.jpg`), box `.screen-card__screen` sulle coordinate ufficiali
 * del vettoriale, power-on LCD all'ingresso, caption con reveal per-parola.
 * Cambia solo il contenuto dello schermo (G3DemoSite, il gestionale) e la
 * caption con reveal per-parola + link "Visit demo" verso /projects/g3.
 */
export default function G3ScreenCard({ active }: { active: boolean }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const captionNameRef = useRef<HTMLSpanElement>(null);
  const captionLinkRef = useRef<HTMLAnchorElement>(null);

  // Power-on / power-off LCD dello schermo — identico a ScreenCard.
  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    tlRef.current?.kill();

    const OFF = { opacity: 0, filter: "brightness(1.8)", scale: 1.02 };

    if (!active) {
      if (Number(gsap.getProperty(screen, "opacity")) < 0.01) {
        gsap.set(screen, OFF);
        return;
      }
      const off = gsap.timeline({ onComplete: () => gsap.set(screen, OFF) });
      tlRef.current = off;
      off.to(screen, { opacity: 0, filter: "brightness(0.6)", duration: 0.2, ease: "power2.in" });
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
    tl.to(screen, { filter: "brightness(1)", duration: 0.6, ease: "power2.out" }, "-=0.1").to(
      screen,
      { scale: 1, duration: 0.6, ease: "power2.out" },
      "<",
    );

    return () => {
      tl.kill();
    };
  }, [active]);

  // Caption reveal per-parola + link "Visit demo" (stesso trucco di ScreenCard).
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
    tl.to(split.words, { yPercent: 0, stagger: 0.06, ease: "expo.out", duration: 0.7 }).to(
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
          src="/hero/hero1-j5-bg.jpg"
          alt="Postazione con Studio Display"
          draggable={false}
        />
        <div className="screen-card__screen" ref={screenRef} aria-hidden="true">
          <G3DemoSite active={active} />
        </div>
      </div>

      <p className="screen-card__caption">
        <span className="screen-card__caption-name" ref={captionNameRef}>
          G3 Modena — Gestionale &amp; backoffice
        </span>
        <Link
          href="/projects/g3"
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
