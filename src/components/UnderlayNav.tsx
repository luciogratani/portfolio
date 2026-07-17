"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import CrispHero from "./CrispHero";
import ScreenCard from "./ScreenCard";
import SfccScreenCard from "./SfccScreenCard";
import BistroScreenCard from "./BistroScreenCard";
import TaskoScreenCard from "./TaskoScreenCard";
import G3ScreenCard from "./G3ScreenCard";
import ScrollSections, { type ScrollSectionsHandle } from "./ScrollSections";
import { peekReturn, clearReturn, saveCurrentSection } from "@/lib/return-nav";

// Voci del menu mappate 1:1 sull'ordine dei figli di <ScrollSections> in fondo
// al componente (0 = hero, 1-5 = card). Nomi presi dalle caption reali di ogni
// *ScreenCard (screen-card__caption-name), abbreviati dove la caption ha un
// sottotitolo lungo.
const NAV_SECTIONS: { index: number; label: string }[] = [
  { index: 0, label: "Home" },
  { index: 1, label: "GiGi" },
  { index: 2, label: "SFCC" },
  { index: 3, label: "Vibe Bistro" },
  { index: 4, label: "Tasko" },
  { index: 5, label: "G3 Modena" },
];

/**
 * Fixed Underlay Navigation — port del pen Osmo (https://osmo.supply/)
 * Markup e logica GSAP originali, adattati a React:
 * - i querySelector sono scopati al root del componente (niente document-wide);
 * - l'init gira in useEffect (al posto di DOMContentLoaded) con cleanup.
 *
 * Il contenuto di [data-main] è il CrispHero (loader → slideshow). Finché il
 * loader non ha finito (`loaded === false`) l'header col toggle "Menu" resta
 * nascosto e non cliccabile (gating via data-loaded + CSS in crisp-hero.css).
 */
export default function UnderlayNav() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  // Menu aperto → lo scroll a schede è disabilitato.
  const [menuOpen, setMenuOpen] = useState(false);
  // Sezione dello scroll attualmente a schermo (0 = hero). Serve per attivare
  // l'autoplay dello slideshow solo quando l'hero è quella "a fuoco".
  const [currentSection, setCurrentSection] = useState(0);
  // True mentre è in corso uno step di scroll → il toggle menu è bloccato.
  const scrollLockedRef = useRef(false);
  // Handle imperativo di ScrollSections (goTo) e ponte verso la chiusura del
  // menu: una voce del menu deve chiudere il pannello e SOLO a chiusura
  // conclusa (onComplete/onReverseComplete della sua timeline) far scattare il
  // salto, altrimenti il lock dello scroll e quello del toggle si accavallano.
  const scrollSectionsRef = useRef<ScrollSectionsHandle>(null);
  const closeThenGoToRef = useRef<(index: number) => void>(() => {});
  // Versione in state dello stesso lock: serve a far partire effetti (es. il
  // power-on di ScreenCard) solo a transizione conclusa, non allo start dello step.
  const [scrollLocked, setScrollLocked] = useState(false);
  // Con lo scroll in loop si può tornare all'hero dall'ultima card. L'autoplay
  // dello slideshow gioca solo al PRIMISSIMO ingresso: una volta lasciato l'hero
  // non riparte più al rientro (hero "calmo"). Il flag si alza nel handler di
  // cambio sezione (non in un effect). Vedi CrispHero.autoplayActive.
  const [heroLeft, setHeroLeft] = useState(false);

  // Rientro da un progetto (vedi src/lib/return-nav): l'indice della scheda a cui
  // tornare saltando hero + intro, o null per un accesso fresco/reload. Deciso
  // UNA volta al mount con una lettura pura (nessun effetto sul markup → nessun
  // mismatch di hydration); il flag one-shot viene consumato subito dopo.
  const [returnSection] = useState<number | null>(() => peekReturn());
  useEffect(() => {
    clearReturn();
  }, []);
  // Traccia di continuo la sezione corrente, così un link-progetto sa a quale
  // scheda far tornare.
  useEffect(() => {
    saveCurrentSection(currentSection);
  }, [currentSection]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(CustomEase);
    if (!CustomEase.get("energy")) {
      CustomEase.create("energy", "M0,0 C0.32,0.72 0,1 1,1");
    }

    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
    const qa = <T extends Element>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));

    const toggleBtn = q<HTMLButtonElement>("[data-underlay-nav-toggle]");
    const toggleLabels = qa<HTMLElement>(".underlay-nav__toggle-label");
    const toggleBars = qa<HTMLElement>(".underlay-nav__toggle-bar");
    const menuEl = q<HTMLElement>("[data-underlay-nav-menu]");
    const largeItems = qa<HTMLElement>("[data-reveal-l]");
    const smallItems = qa<HTMLElement>("[data-reveal-s]");
    const menuBorder = q<HTMLElement>(".underlay-nav__bottom-border");
    const mainEl = q<HTMLElement>("[data-main]");
    const overlayEl = q<HTMLElement>("[data-underlay-nav-overlay]");
    const darkEl = q<HTMLElement>(".underlay-nav__dark");
    const corners = qa<HTMLElement>(".underlay-nav__corner");
    const overlayBorders = qa<HTMLElement>(".underlay-nav__border-row");

    if (!toggleBtn || !menuEl || !mainEl || !overlayEl) return;

    const closedColor = getComputedStyle(toggleBtn).color;
    const openColor = getComputedStyle(menuEl).color;

    let isOpen = false;
    let tl: gsap.core.Timeline;
    let enterEndTime = 0;

    const getMenuOffset = () => -menuEl.offsetWidth;

    gsap.set(overlayEl, { visibility: "hidden", pointerEvents: "none" });
    gsap.set(darkEl, { autoAlpha: 0 });
    gsap.set(mainEl, { x: 0 });
    gsap.set(toggleLabels, { yPercent: 0 });
    gsap.set(toggleBars, { y: 0, rotation: 0 });
    gsap.set(menuBorder, { scaleX: 0 });
    gsap.set(overlayBorders[0], { yPercent: -100 });
    gsap.set(overlayBorders[1], { yPercent: 100 });
    gsap.set(corners, { scale: 0 });

    function buildTimeline() {
      tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "energy",
          easeReverse: "power2.inOut",
        },
      });

      tl.set(overlayEl, { visibility: "visible", pointerEvents: "auto" }, 0);

      tl.to([mainEl, overlayEl], { x: getMenuOffset, duration: 0.7 }, 0)
        .to(darkEl, { autoAlpha: 1, duration: 0.5 }, 0)
        .to(corners, { scale: 1, duration: 0.5 }, 0)
        .to(overlayBorders, { yPercent: 0, duration: 0.5 }, 0)
        .to(toggleLabels, { yPercent: -100, duration: 0.4 }, 0)
        .to(toggleBtn, { color: openColor, duration: 0.4 }, 0)
        .to(
          toggleBars[0],
          {
            y: "0.25em",
            rotation: 45,
            duration: 0.35,
            ease: "back.out(1.4)",
            easeReverse: "power3.out",
          },
          0.05,
        )
        .to(
          toggleBars[1],
          {
            y: "-0.25em",
            rotation: -45,
            duration: 0.35,
            ease: "back.out(1.4)",
            easeReverse: "power3.out",
          },
          0.05,
        )
        .fromTo(
          largeItems,
          { autoAlpha: 0, xPercent: 25 },
          { autoAlpha: 1, xPercent: 0, duration: 0.7, stagger: 0.05 },
          0,
        )
        .fromTo(
          smallItems,
          { autoAlpha: 0, yPercent: 100 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.5,
            stagger: 0.03,
            ease: "power3.out",
          },
          0.3,
        )
        .to(menuBorder, { scaleX: 1, duration: 0.5 }, "<");

      enterEndTime = tl.duration();

      tl.addPause();

      tl.to([largeItems, smallItems], { autoAlpha: 0, duration: 0.3 }, "<")
        .to([mainEl, overlayEl], { x: 0, duration: 0.6 }, "<")
        .to(darkEl, { autoAlpha: 0, duration: 0.35, ease: "power2.inOut" }, "<")
        .to(corners, { scale: 0, duration: 0.5 }, "<")
        .to(overlayBorders[0], { yPercent: -100, duration: 0.5 }, "<")
        .to(overlayBorders[1], { yPercent: 100, duration: 0.5 }, "<")
        .to(toggleBtn, { color: closedColor, duration: 0.25 }, "<+=0.1")
        .to(
          toggleLabels,
          { yPercent: 0, duration: 0.25, ease: "power3.in" },
          "<",
        )
        .to(
          toggleBars,
          { y: 0, rotation: 0, duration: 0.25, ease: "power3.in" },
          "<",
        )
        .set(overlayEl, { visibility: "hidden", pointerEvents: "none" });
    }

    function toggle() {
      // Menu bloccato mentre è in corso uno step di scroll.
      if (scrollLockedRef.current) return;
      isOpen = !isOpen;
      setMenuOpen(isOpen);
      toggleBtn!.setAttribute("aria-expanded", String(isOpen));
      toggleBtn!.setAttribute("aria-label", isOpen ? "close menu" : "open menu");
      document.body.setAttribute("data-menu-status", isOpen ? "open" : "");

      if (isOpen) {
        tl.invalidate();
        if (tl.time() >= enterEndTime) tl.timeScale(1).restart();
        else tl.timeScale(1).play();
      } else {
        if (tl.time() < enterEndTime) tl.timeScale(1).reverse();
        else tl.timeScale(1).play();
      }
    }

    buildTimeline();

    // Chiude il menu (se aperto) e rimanda il salto di sezione a chiusura
    // conclusa. `toggle()` sceglie da sola reverse()/play() in base a
    // `tl.time()`: leggiamo la STESSA condizione qui PRIMA di chiamarla per
    // sapere quale evento della timeline segna la fine (onReverseComplete se
    // sta tornando a 0, onComplete se sta proseguendo verso la coda "chiusa").
    // Nessuno dei due eventi è già cablato altrove su `tl` → sicuro attaccarli
    // al volo e ripulirli subito dopo lo sparo.
    function closeThenGoTo(index: number) {
      if (scrollLockedRef.current) return;
      if (!isOpen) {
        scrollSectionsRef.current?.goTo(index);
        return;
      }
      const closingViaReverse = tl.time() < enterEndTime;
      const event = closingViaReverse ? "onReverseComplete" : "onComplete";
      toggle();
      tl.eventCallback(event, () => {
        tl.eventCallback(event, null);
        scrollSectionsRef.current?.goTo(index);
      });
    }
    closeThenGoToRef.current = closeThenGoTo;

    const onToggleClick = () => toggle();
    const onOverlayClick = () => {
      if (isOpen) toggle();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        toggle();
        toggleBtn!.focus();
      }
    };

    toggleBtn.addEventListener("click", onToggleClick);
    overlayEl.addEventListener("click", onOverlayClick);
    document.addEventListener("keydown", onKeyDown);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isOpen) {
          gsap.set([mainEl, overlayEl], { x: getMenuOffset() });
        } else {
          tl.invalidate();
        }
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      toggleBtn.removeEventListener("click", onToggleClick);
      overlayEl.removeEventListener("click", onOverlayClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      tl.kill();
      document.body.removeAttribute("data-menu-status");
    };
  }, []);

  return (
    <div className="underlay-nav" ref={rootRef}>
      <div className="underlay-nav__backdrop" aria-hidden="true" />
      <header className="underlay-nav__header" data-loaded={loaded}>
        <div className="underlay-nav__bar">
          <div className="underlay-nav__container">
            <Link href="/" className="underlay-nav__logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                viewBox="0 0 110 25"
                fill="none"
                className="underlay-nav__logo-svg"
              >
                <path
                  d="M38.6539 24.1686C42.7853 24.1686 46.43 22.0917 48.6052 18.9263C49.8548 22.1497 53.0871 24.1686 57.3667 24.1686C60.4499 24.1686 63.0505 23.1833 64.7214 21.5632L64.4805 23.6683H69.7011L70.9507 12.7679L73.8518 23.6683H79.0772L81.9784 12.7679L83.2271 23.6683H88.4477L87.8886 18.7885C90.0518 22.0313 93.7424 24.1686 97.9334 24.1686C104.598 24.1686 110 18.766 110 12.1016C110 5.43732 104.596 0.0346429 97.9318 0.0346429C92.7612 0.0346429 88.3518 3.28785 86.6342 7.85749L85.7907 0.499502H80.0215L76.4629 13.8708L72.9044 0.499502H67.1351L66.3246 7.56906C66.2264 5.51224 65.382 3.64878 63.9254 2.29932C62.3021 0.795175 60.0342 0 57.3659 0C54.8659 0 52.7116 0.712193 51.1358 2.06004C49.974 3.05421 49.2135 4.33761 48.9194 5.76119C46.7933 2.32429 42.9923 0.0346429 38.6539 0.0346429C31.9896 0.0346429 26.5869 5.43732 26.5869 12.1016C26.5869 18.766 31.9896 24.1686 38.6539 24.1686ZM97.9318 5.46471C101.597 5.46471 104.569 8.43594 104.569 12.1016C104.569 15.7673 101.597 18.7386 97.9318 18.7386C94.2661 18.7386 91.2949 15.7673 91.2949 12.1016C91.2949 8.43594 94.2661 5.46471 97.9318 5.46471ZM57.3667 5.05786C59.6321 5.05786 61.0227 6.10681 61.0855 7.86393L61.1049 8.39808H66.2304L65.7019 13.0128C65.4392 12.5899 65.1275 12.1991 64.7641 11.8438C63.5685 10.6773 61.8154 9.88289 59.5524 9.48328L56.5014 8.93706C54.48 8.5729 54.0659 7.94127 54.0659 7.10501C54.0659 6.89554 54.1586 5.05705 57.3667 5.05705V5.05786ZM55.1761 14.0094L58.7709 14.6837C61.092 15.1293 61.4046 16.0711 61.4046 16.9339C61.4046 18.2963 59.8569 19.1422 57.365 19.1422C54.4059 19.1422 53.2877 17.4729 53.2289 16.0437L53.2071 15.5128H50.2278C50.5461 14.4308 50.7201 13.2868 50.7201 12.1016C50.7201 12.0452 50.7168 11.9889 50.716 11.9325C51.7876 12.95 53.2836 13.6598 55.1753 14.0094H55.1761ZM38.6539 5.46471C42.3196 5.46471 45.2908 8.43594 45.2908 12.1016C45.2908 15.7673 42.3196 18.7386 38.6539 18.7386C34.9882 18.7386 32.017 15.7673 32.017 12.1016C32.017 8.43594 34.9882 5.46471 38.6539 5.46471Z"
                  fill="#F4F4F4"
                />
                <path
                  d="M16.3506 9.9554L21.6985 4.6075L19.5619 2.47092L14.214 7.81882C13.986 8.04762 13.5953 7.88569 13.5953 7.56262V0H10.5741V9.12397C10.5741 9.92478 9.92476 10.5741 9.12395 10.5741H0V13.5953H7.56261C7.88567 13.5953 8.04761 13.9861 7.8188 14.2141L2.47172 19.5619L4.6083 21.6985L9.95618 16.3506C10.1842 16.1226 10.5749 16.2838 10.5749 16.6068V24.1694H13.5961V15.0455C13.5961 14.2447 14.2454 13.5953 15.0463 13.5953H24.1702V10.5741H16.6076C16.2845 10.5741 16.1226 10.1834 16.3514 9.9554H16.3506Z"
                  fill="#F85931"
                />
              </svg>
            </Link>

            <button
              type="button"
              data-underlay-nav-toggle
              aria-expanded="false"
              aria-label="open menu"
              className="underlay-nav__toggle"
            >
              <span className="underlay-nav__toggle-text">
                <span className="underlay-nav__toggle-label">Menu</span>
                <span className="underlay-nav__toggle-label">Close</span>
              </span>
              <span className="underlay-nav__toggle-icon">
                <span className="underlay-nav__toggle-bar" />
                <span className="underlay-nav__toggle-bar" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <nav data-underlay-nav-menu className="underlay-nav__menu">
        <div className="underlay-nav__inner">
          <ul className="underlay-nav__list">
            {NAV_SECTIONS.map(({ index, label }) => {
              const active = currentSection === index;
              return (
                <li data-reveal-l key={index}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    className={
                      "underlay-nav__link-large" + (active ? " w--current" : "")
                    }
                    onClick={() => closeThenGoToRef.current(index)}
                  >
                    <span className="underlay-nav__link-label">{label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="underlay-nav__bottom">
            <div className="underlay-nav__bottom-col">
              <div data-reveal-s>
                <span className="underlay-nav__link-small is--faded">
                  Socials
                </span>
              </div>
              <ul className="underlay-nav__list is--small">
                <li data-reveal-s>
                  <a href="#" className="underlay-nav__link-small">
                    Instagram
                  </a>
                </li>
                <li data-reveal-s>
                  <a href="#" className="underlay-nav__link-small">
                    LinkedIn
                  </a>
                </li>
                <li data-reveal-s>
                  <a href="#" className="underlay-nav__link-small">
                    X/Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div className="underlay-nav__bottom-col">
              <div data-reveal-s>
                <span className="underlay-nav__link-small is--faded">
                  Quick Links
                </span>
              </div>
              <ul className="underlay-nav__list is--small">
                <li data-reveal-s>
                  <a href="#" className="underlay-nav__link-small">
                    Privacy Policy ↗
                  </a>
                </li>
                <li data-reveal-s>
                  <a href="#" className="underlay-nav__link-small">
                    Terms &amp; Conditions ↗
                  </a>
                </li>
              </ul>
            </div>
            <div className="underlay-nav__bottom-border" />
          </div>
        </div>
      </nav>

      <div data-underlay-nav-overlay className="underlay-nav__overlay">
        <div className="underlay-nav__dark" />
        <div className="underlay-nav__borders">
          <div className="underlay-nav__border-row">
            <div className="underlay-nav__border" />
            <div className="underlay-nav__corner" />
          </div>
          <div className="underlay-nav__border-row">
            <div className="underlay-nav__corner is--bottom" />
            <div className="underlay-nav__border" />
          </div>
        </div>
      </div>

      <main data-main>
        <ScrollSections
          ref={scrollSectionsRef}
          enabled={loaded && !menuOpen}
          initialIndex={returnSection ?? 0}
          onLockChange={(l) => {
            scrollLockedRef.current = l;
            setScrollLocked(l);
          }}
          onCurrentChange={(i) => {
            if (i !== 0) setHeroLeft(true);
            setCurrentSection(i);
          }}
        >
          <CrispHero
            onLoaded={() => setLoaded(true)}
            autoplayActive={loaded && currentSection === 0 && !menuOpen && !heroLeft}
            skipIntro={returnSection != null}
          />

          <ScreenCard active={currentSection === 1 && !scrollLocked} />

          <SfccScreenCard active={currentSection === 2 && !scrollLocked} />

          <BistroScreenCard active={currentSection === 3 && !scrollLocked} />

          <TaskoScreenCard active={currentSection === 4 && !scrollLocked} />

          <G3ScreenCard active={currentSection === 5 && !scrollLocked} />
        </ScrollSections>
      </main>
    </div>
  );
}
