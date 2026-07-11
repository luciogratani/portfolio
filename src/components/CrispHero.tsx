"use client";

/* eslint-disable @next/next/no-img-element */
// Le immagini del loader/slideshow restano <img> nativi: sono ~20 frame
// decorativi con transform/size animati da GSAP, dove next/image
// interferirebbe col layout. (L'ottimizzazione immagini vale la pena altrove.)

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

// Immagini reali del portfolio (in /public/hero). IMAGES[0] è quella che scala
// a schermo pieno a fine loader ed è la prima slide → conviene sia ad alta ris.
// `title` = testo mostrato nella textbox in basso per ogni slide (si aggiorna a
// ogni cambio). Immagini e titoli sono PLACEHOLDER: da customizzare.
const IMAGES = [
  { src: "/hero/imgi_1_cover.jpg", alt: "Immagine hero 1", title: "Titolo hero 1" },
  { src: "/hero/imgi_2_cover.jpg", alt: "Immagine hero 2", title: "Titolo hero 2" },
  { src: "/hero/imgi_5_cover.jpg", alt: "Immagine hero 3", title: "Titolo hero 3" },
  { src: "/hero/imgi_6_cover.jpg", alt: "Immagine hero 4", title: "Titolo hero 4" },
  { src: "/hero/imgi_7_cover.jpg", alt: "Immagine hero 5", title: "Titolo hero 5" },
];

// Il pen Osmo è tarato ESATTAMENTE per 5 immagini: con 5, lo slot della striscia
// che a fine spazzata cade al centro del viewport (quindi scala a schermo pieno =
// "diventa hero") è quello centrale, indice 2 — come nell'originale, dove
// `is--scaling` è sul 3° dei 5 elementi. La spazzata ha ampiezza fissa
// (xPercent ±500): con un numero di immagini diverso da 5 il centro si sfasa.
// NON cambiare il numero di immagini senza ritarare questo valore.
const LOADER_CENTER = 2;
const HERO_IMG = IMAGES[0];
// Ruota l'ordine della striscia così che HERO_IMG (= IMAGES[0] = prima slide)
// capiti nello slot centrale: l'immagine che scala a schermo pieno coincide
// quindi con la prima slide dello slideshow.
const LOADER_ORDER = IMAGES.map(
  (_, i) =>
    IMAGES[(((i - LOADER_CENTER) % IMAGES.length) + IMAGES.length) % IMAGES.length],
);

// Autoplay dello slideshow: intervallo tra un avanzamento e il successivo. La
// transizione "wipe" dura 1.5s, quindi ogni slide resta ferma ~3.5s. Attivo solo
// quando l'hero è la sezione a fuoco e il menu è chiuso (vedi `autoplayActive`).
const AUTOPLAY_MS = 5000;

/**
 * Crisp Loading Animation — port del pen Osmo (https://osmo.supply/).
 * Fa da loader (a durata fissa, "fake") e poi diventa lo slideshow-hero.
 * Chiama `onLoaded` a fine timeline: è l'aggancio che sblocca il menu.
 */
export default function CrispHero({
  onLoaded,
  autoplayActive = false,
}: {
  onLoaded?: () => void;
  autoplayActive?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const onLoadedRef = useRef(onLoaded);
  // Stato "autoplay attivo" letto dal timer (che vive nell'effect a mount unico).
  const autoplayActiveRef = useRef(autoplayActive);
  // Esposto dall'effect: azzera e fa ripartire il timer da un intervallo pieno.
  const restartAutoplayRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
    autoplayActiveRef.current = autoplayActive;
  });

  useEffect(() => {
    const container = rootRef.current;
    if (!container) return;

    gsap.registerPlugin(SplitText, CustomEase);
    if (!CustomEase.get("slideshow-wipe")) {
      CustomEase.create("slideshow-wipe", "0.625, 0.05, 0, 1");
    }

    const heading = container.querySelectorAll<HTMLElement>(".crisp-header__h1");
    const revealImages = container.querySelectorAll<HTMLElement>(
      ".crisp-loader__group > *",
    );
    const isScaleUp =
      container.querySelectorAll<HTMLElement>(".crisp-loader__media");
    const isScaleDown = container.querySelectorAll<HTMLElement>(
      ".crisp-loader__media .is--scale-down",
    );
    const isRadius = container.querySelectorAll<HTMLElement>(
      ".crisp-loader__media.is--scaling.is--radius",
    );
    const smallElements = container.querySelectorAll<HTMLElement>(
      ".crisp-header__top, .crisp-header__p",
    );
    const sliderNav = container.querySelectorAll<HTMLElement>(
      ".crisp-header__slider-nav > *",
    );

    /* ---------- Loading timeline ---------- */
    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => container.classList.remove("is--hidden"),
    });

    let split: SplitText | undefined;
    if (heading.length) {
      split = new SplitText(heading, { type: "words", mask: "words" });
      gsap.set(split.words, { yPercent: 110 });
    }

    if (revealImages.length) {
      tl.fromTo(
        revealImages,
        { xPercent: 500 },
        { xPercent: -500, duration: 2.5, stagger: 0.05 },
      );
    }

    if (isScaleDown.length) {
      tl.to(
        isScaleDown,
        {
          scale: 0.5,
          duration: 2,
          stagger: { each: 0.05, from: "edges", ease: "none" },
          onComplete: () => {
            isRadius.forEach((el) => el.classList.remove("is--radius"));
          },
        },
        "-=0.1",
      );
    }

    if (isScaleUp.length) {
      // La media finale deve combaciare col box REALE dell'hero attivo, non col
      // viewport: `.crisp-header` è dentro `.section__inner` (sovradimensionato
      // di ±60px per la parallasse dello scroll), quindi è alto 100dvh+120px.
      // Scalando a 100vw/100dvh come nell'originale si finiva 120px più piccoli
      // dello slide dello slideshow → salto secco all'handoff. Misuro il box e
      // scalo esattamente a quello: object-fit cover identico, nessuno scatto.
      tl.fromTo(
        isScaleUp,
        { width: "10em", height: "10em" },
        {
          width: () => container.offsetWidth,
          height: () => container.offsetHeight,
          duration: 2,
        },
        "< 0.5",
      );
    }

    if (sliderNav.length) {
      tl.from(
        sliderNav,
        { yPercent: 150, stagger: 0.05, ease: "expo.out", duration: 1 },
        "-=0.9",
      );
    }

    if (split && split.words.length) {
      tl.to(
        split.words,
        { yPercent: 0, stagger: 0.075, ease: "expo.out", duration: 1 },
        "< 0.1",
      );
    }

    if (smallElements.length) {
      tl.from(
        smallElements,
        { opacity: 0, ease: "power1.inOut", duration: 0.2 },
        "< 0.15",
      );
    }

    tl.call(
      () => {
        container.classList.remove("is--loading");
        onLoadedRef.current?.();
      },
      undefined,
      "+=0.45",
    );

    /* ---------- Slideshow ---------- */
    const slides = Array.from(
      container.querySelectorAll<HTMLElement>('[data-slideshow="slide"]'),
    );
    const inner = Array.from(
      container.querySelectorAll<HTMLElement>('[data-slideshow="parallax"]'),
    );
    const thumbs = Array.from(
      container.querySelectorAll<HTMLElement>('[data-slideshow="thumb"]'),
    );
    const titleEl = container.querySelector<HTMLElement>(
      '[data-slideshow="title"]',
    );

    let current = 0;
    const length = slides.length;
    let animating = false;
    const animationDuration = 1.5;
    const slideshowTimelines: gsap.core.Timeline[] = [];

    slides.forEach((slide, i) => slide.setAttribute("data-index", String(i)));
    thumbs.forEach((thumb, i) => thumb.setAttribute("data-index", String(i)));
    slides[current]?.classList.add("is--current");
    thumbs[current]?.classList.add("is--current");
    if (titleEl) titleEl.textContent = IMAGES[current].title;

    function navigate(direction: number, targetIndex: number | null = null) {
      if (animating) return;
      animating = true;

      const previous = current;
      current =
        targetIndex !== null
          ? targetIndex
          : direction === 1
            ? current < length - 1
              ? current + 1
              : 0
            : current > 0
              ? current - 1
              : length - 1;

      const currentSlide = slides[previous];
      const currentInner = inner[previous];
      const upcomingSlide = slides[current];
      const upcomingInner = inner[current];

      const stl = gsap.timeline({
        defaults: { duration: animationDuration, ease: "slideshow-wipe" },
        onStart() {
          upcomingSlide.classList.add("is--current");
          thumbs[previous].classList.remove("is--current");
          thumbs[current].classList.add("is--current");
          if (titleEl) titleEl.textContent = IMAGES[current].title;
        },
        onComplete() {
          currentSlide.classList.remove("is--current");
          animating = false;
        },
      });
      stl
        .to(currentSlide, { xPercent: -direction * 100 }, 0)
        .to(currentInner, { xPercent: direction * 75 }, 0)
        .fromTo(upcomingSlide, { xPercent: direction * 100 }, { xPercent: 0 }, 0)
        .fromTo(upcomingInner, { xPercent: -direction * 75 }, { xPercent: 0 }, 0);
      slideshowTimelines.push(stl);
    }

    /* ---------- Autoplay ---------- */
    // Un solo intervallo, sempre vivo; a ogni tick avanza SOLO se l'hero è a
    // fuoco (autoplayActiveRef) e non c'è già una transizione in corso.
    // `restartAutoplay` lo azzera: lo si richiama sull'interazione manuale e
    // quando l'hero torna a fuoco, così il conteggio riparte pieno.
    let autoplayTimer: ReturnType<typeof setInterval> | undefined;
    const restartAutoplay = () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        if (!autoplayActiveRef.current || animating) return;
        navigate(1);
      }, AUTOPLAY_MS);
    };
    restartAutoplayRef.current = restartAutoplay;
    restartAutoplay();

    const thumbHandlers: Array<[HTMLElement, (e: Event) => void]> = [];
    thumbs.forEach((thumb) => {
      const handler = (event: Event) => {
        const targetIndex = parseInt(
          (event.currentTarget as HTMLElement).getAttribute("data-index") ?? "0",
          10,
        );
        if (targetIndex === current || animating) return;
        const direction = targetIndex > current ? 1 : -1;
        navigate(direction, targetIndex);
        restartAutoplay(); // click spontaneo → il timer riparte da zero
      };
      thumb.addEventListener("click", handler);
      thumbHandlers.push([thumb, handler]);
    });

    /* ---------- Cleanup (anche per il doppio-mount di StrictMode in dev) ---------- */
    return () => {
      tl.kill();
      clearInterval(autoplayTimer);
      restartAutoplayRef.current = null;
      slideshowTimelines.forEach((t) => t.kill());
      split?.revert();
      thumbHandlers.forEach(([thumb, handler]) =>
        thumb.removeEventListener("click", handler),
      );
      gsap.killTweensOf([...slides, ...inner, ...thumbs, ...isScaleUp]);
      gsap.set(isScaleUp, { clearProps: "width,height,transform" });
      slides.forEach((s) => s.classList.remove("is--current"));
      thumbs.forEach((t) => t.classList.remove("is--current"));
      isRadius.forEach((el) => el.classList.add("is--radius"));
      container.classList.add("is--loading", "is--hidden");
    };
  }, []);

  // Quando l'hero torna "a fuoco" (autoplayActive true) riparte il conteggio da
  // un intervallo pieno, così non avanza subito per tempo residuo accumulato.
  useEffect(() => {
    if (autoplayActive) restartAutoplayRef.current?.();
  }, [autoplayActive]);

  return (
    <section
      ref={rootRef}
      data-slideshow="wrap"
      className="crisp-header is--loading is--hidden"
    >
      <div className="crisp-header__slider">
        <div className="crisp-header__slider-list">
          {IMAGES.map((img, i) => (
            <div
              key={i}
              data-slideshow="slide"
              className={`crisp-header__slider-slide${i === 0 ? " is--current" : ""}`}
            >
              <img
                className="crisp-header__slider-slide-inner"
                src={img.src}
                alt={img.alt}
                data-slideshow="parallax"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="crisp-loader">
        <div className="crisp-loader__wrap">
          <div className="crisp-loader__groups">
            <div className="crisp-loader__group is--duplicate">
              {LOADER_ORDER.map((img, i) => (
                <div key={i} className="crisp-loader__single">
                  <div className="crisp-loader__media">
                    <img loading="eager" src={img.src} alt={img.alt} className="crisp-loader__cover-img" />
                  </div>
                </div>
              ))}
            </div>
            <div className="crisp-loader__group is--relative">
              {LOADER_ORDER.map((img, i) => {
                const scaling = img === HERO_IMG;
                return (
                  <div key={i} className="crisp-loader__single">
                    <div className={`crisp-loader__media${scaling ? " is--scaling is--radius" : ""}`}>
                      <img
                        loading="eager"
                        src={img.src}
                        alt={img.alt}
                        className={`crisp-loader__cover-img${scaling ? "" : " is--scale-down"}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="crisp-loader__fade" />
          <div className="crisp-loader__fade is--duplicate" />
        </div>
      </div>

      <div className="crisp-header__content">
        <div className="crisp-header__center">
          <h1 className="crisp-header__h1">We just love pixels</h1>
        </div>
        <div className="crisp-header__bottom">
          <div className="crisp-header__slider-nav">
            {IMAGES.map((img, i) => (
              <div
                key={i}
                data-slideshow="thumb"
                className={`crisp-header__slider-nav-btn${i === 0 ? " is--current" : ""}`}
              >
                <img loading="eager" src={img.src} alt={img.alt} className="crisp-loader__cover-img" />
              </div>
            ))}
          </div>
          {/* Ex textbox attribuzione Osmo, riusata come titolo per-slide: il
              testo lo aggiorna il JS a ogni cambio (init + navigate). */}
          <p className="crisp-header__p" data-slideshow="title">
            {IMAGES[0].title}
          </p>
        </div>
      </div>
    </section>
  );
}
