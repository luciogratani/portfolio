"use client";

// Mini-sito Vibe Bistro leggero e "live" (mirror di SfccDemoSite.tsx), pensato
// per vivere dentro lo schermo del MacBook di BistroScreenCard: design fisso
// 1600×1034, poi deformato via matrix3d dal genitore. NON è la route reale
// /projects/bistro: solo header + hero + marquee "congelati" (niente scroll),
// ogni elemento cliccabile porta alla route reale.
//
// Vita del sito (gated su `active`, si resetta all'uscita così si rigioca al
// rientro):
// 1. Entrance: header e hero entrano con stagger GSAP (fade + y), come
//    SfccDemoSite/DemoSite.
// 2. Marquee ticker: loop CSS seamless (`.is-live`), acceso ~0.8s dopo
//    l'entrance, spento subito all'uscita — stesso pattern del marquee SFCC.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  bistroSyne,
  bistroPlayfair,
  bistroSpaceGrotesk,
} from "@/fonts/bistro-fonts";
import { markReturnFromProject } from "@/lib/return-nav";

const PROJECT_ROUTE = "/projects/bistro";

const NAV_ITEMS = ["Menu", "Vibe Check", "Events", "Locations"];

const MARQUEE_TEXT =
  "★ BURGERS THAT SLAP ★ CRAFT COCKTAILS ★ RETRO VIBES ONLY ★ OPEN UNTIL 2AM ★ BEST IN THE CITY ";

export default function BistroDemoSite({ active }: { active: boolean }) {
  const router = useRouter();
  const openProject = () => {
    markReturnFromProject();
    router.push(PROJECT_ROUTE);
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // `live` = loop ambientali accesi (dopo l'entrance). Spento subito quando la
  // card esce di fuoco, così i loop CSS si resettano e ripartono.
  const [live, setLive] = useState(false);

  // Entrance: header e hero entrano con stagger quando `active`.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Entrance granulare (come DemoSite/GiGi): non muoviamo i due blocchi hero
    // interi, ma i singoli elementi in stagger, così l'ingresso è più fluido.
    const targets = (
      [
        headerRef.current,
        titleRef.current,
        subtitleRef.current,
        ctaRowRef.current,
        heroImgRef.current,
        marqueeRef.current,
      ] as (HTMLElement | null)[]
    ).filter((el): el is HTMLElement => el !== null);

    const ctx = gsap.context(() => {
      if (!active) {
        gsap.set(targets, { opacity: 0, y: 28 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 28 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.1,
      });
    }, root);

    return () => ctx.revert();
  }, [active]);

  // Accende i loop ~0.8s dopo l'entrance; li spegne (nel cleanup) all'uscita.
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setLive(true), 800);
    return () => {
      clearTimeout(t);
      setLive(false);
    };
  }, [active]);

  return (
    <div
      ref={rootRef}
      className={`bistro-demo-site ${bistroSyne.variable} ${bistroPlayfair.variable} ${bistroSpaceGrotesk.variable} ${
        live ? "is-live" : ""
      }`}
      onClick={openProject}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {/* Header */}
      <div ref={headerRef} className="bistro-demo-site__header">
        <Link
          href={PROJECT_ROUTE}
          onClick={markReturnFromProject}
          className="bistro-demo-site__logo"
        >
          VIBE*BISTRO
        </Link>

        <nav className="bistro-demo-site__nav">
          {NAV_ITEMS.map((label) => (
            <button
              key={label}
              type="button"
              className="bistro-demo-site__nav-link"
            >
              {label}
            </button>
          ))}
        </nav>

        <button type="button" className="bistro-demo-site__cta">
          Book a Table
        </button>
      </div>

      {/* Hero */}
      <div className="bistro-demo-site__hero">
        <div className="bistro-demo-site__hero-content">
          <h1 ref={titleRef} className="bistro-demo-site__title">
            NO CAP,
            <br />
            JUST <span>FLAVOR</span>
          </h1>
          <p ref={subtitleRef} className="bistro-demo-site__subtitle">
            Serving 70s aesthetics with a modern twist. Locally sourced,
            highkey delicious, and strictly for the vibers.
          </p>
          <div ref={ctaRowRef} className="bistro-demo-site__cta-row">
            <button
              type="button"
              className="bistro-demo-site__cta"
              style={{ background: "#ff4d00", color: "white" }}
            >
              Order Now
            </button>
            <button
              type="button"
              className="bistro-demo-site__cta bistro-demo-site__cta-outline"
            >
              View Menu
            </button>
          </div>
        </div>

        <div ref={heroImgRef} className="bistro-demo-site__hero-img">
          <span
            className="bistro-demo-site__tag"
            style={{ top: "18%", left: "8%" }}
          >
            #AESTHETIC
          </span>
          <span
            className="bistro-demo-site__tag"
            style={{ bottom: "32%", right: "16%" }}
          >
            LOWKEY FIRE
          </span>
          <div className="bistro-demo-site__sticker">
            FRESH AF
            <br />
            EVERY DAY
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div ref={marqueeRef} className="bistro-demo-site__marquee">
        <div className="bistro-demo-site__marquee-track">
          {MARQUEE_TEXT.repeat(2)}
        </div>
      </div>
    </div>
  );
}
