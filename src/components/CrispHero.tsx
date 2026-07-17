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
// ogni cambio) ed è anche cliccabile: `section` è l'indice (1-based, vedi
// <ScrollSections> in UnderlayNav) della card a cui salta.
// `panFrom`/`panTo` sono i due estremi di `object-position` (asse verticale)
// della panoramica lenta di ogni slide — vedi `startPan` più sotto. Sono per
// immagine perché lo spazio di ritaglio disponibile dipende dall'aspect ratio:
// card4-tasko è verticale (1800×2400) dentro un viewport ~16:9, quindi il
// cover ha pochissimo margine verticale prima di tagliare fuori il device
// (iPad) — la sua escursione resta volutamente più stretta delle altre.
const IMAGES = [
  {
    src: "/hero/slide-1-gigi.webp",
    alt: "Mockup del progetto GiGi",
    title: "GiGi",
    section: 1,
    panFrom: "50% 38%",
    panTo: "50% 62%",
  },
  {
    src: "/hero/slide-2-sfcc.webp",
    alt: "Mockup del progetto SFCC",
    title: "SFCC",
    section: 2,
    panFrom: "50% 38%",
    panTo: "50% 62%",
  },
  {
    src: "/hero/slide-3-bistro.webp",
    alt: "Mockup del progetto Vibe Bistro",
    title: "Vibe Bistro",
    section: 3,
    panFrom: "50% 38%",
    panTo: "50% 62%",
  },
  {
    src: "/hero/slide-4-tasko.webp",
    alt: "Mockup del progetto Tasko",
    title: "Tasko",
    section: 4,
    panFrom: "50% 45%",
    panTo: "50% 55%",
  },
  {
    src: "/hero/slide-5-g3.webp",
    alt: "Mockup del progetto G3 Modena",
    title: "G3 Modena",
    section: 5,
    panFrom: "50% 38%",
    panTo: "50% 62%",
  },
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
  onOpenPreview,
  autoplayActive = false,
  skipIntro = false,
}: {
  onLoaded?: () => void;
  // Click sul titolo della slide corrente: salta alla card corrispondente
  // nella home (goTo su <ScrollSections>), NON naviga a /projects/*.
  onOpenPreview?: (sectionIndex: number) => void;
  autoplayActive?: boolean;
  skipIntro?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const onLoadedRef = useRef(onLoaded);
  const onOpenPreviewRef = useRef(onOpenPreview);
  // Stato "autoplay attivo" letto dal timer (che vive nell'effect a mount unico).
  const autoplayActiveRef = useRef(autoplayActive);
  // Esposto dall'effect: azzera e fa ripartire il timer da un intervallo pieno.
  const restartAutoplayRef = useRef<(() => void) | null>(null);
  // Rientro da un progetto: salta l'intro del loader e va diretto allo stato
  // finale (vedi tl.progress(1) nell'effect). Stabile dal primo render.
  const skipIntroRef = useRef(skipIntro);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
    onOpenPreviewRef.current = onOpenPreview;
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

    // Fatta girare dal `.call` di fine loader qui sotto: parte la panoramica
    // della slide iniziale. È un'indirezione (assegnata più giù, dove la
    // slideshow — e quindi `startPan` — viene definita) perché altrimenti la
    // panoramica da 5s partirebbe al MOUNT, cioè mentre la slide è ancora
    // coperta dal loader: al reveal (~4-7s dopo, a seconda della macchina)
    // sarebbe già finita e la si vedrebbe ferma sul valore finale.
    let firePanOnLoad: (() => void) | undefined = undefined;

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

    // fromTo con valore d'arrivo ESPLICITO, non from: il cleanup qui sotto
    // uccide i tween ma lascia gli stili inline, quindi al secondo mount di
    // StrictMode un `from` rileggerebbe yPercent 150 come valore d'arrivo e
    // animerebbe 150 → 150 (no-op: thumb ritagliate dall'overflow della nav).
    if (sliderNav.length) {
      tl.fromTo(
        sliderNav,
        { yPercent: 150 },
        { yPercent: 0, stagger: 0.05, ease: "expo.out", duration: 1 },
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

    // Idem: `from` qui restava bloccato a opacity 0 → 0 (titolo mai visibile).
    if (smallElements.length) {
      tl.fromTo(
        smallElements,
        { opacity: 0 },
        { opacity: 1, ease: "power1.inOut", duration: 0.2 },
        "< 0.15",
      );
    }

    tl.call(
      () => {
        container.classList.remove("is--loading");
        onLoadedRef.current?.();
        firePanOnLoad?.();
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

    // Titolo iniziale: split a maschera per-parola, pronto per il "rullo". Le
    // parole restano a yPercent 0 (visibili): l'ingresso iniziale lo fa già il
    // fade del loader (opacity su .crisp-header__p tra gli smallElements).
    // `tag: "span"`: il titolo ora è un <button> (per lo swipe alla card, sotto)
    // e span è contenuto fraseggiabile valido — il default di SplitText è
    // <div>, che dentro un <button> sarebbe nesting HTML invalido.
    let titleSplit: SplitText | undefined;
    if (titleEl) {
      titleEl.textContent = IMAGES[current].title;
      titleSplit = new SplitText(titleEl, { type: "words", mask: "words", tag: "span" });
    }
    // Rullo del titolo — stessa tecnica dell'h1: le parole uscenti salgono e
    // spariscono sotto la maschera, poi il nuovo testo (ri-split) entra dal
    // basso in expo.out. Durata totale ~1s: sta comoda dentro il wipe da 1.5s.
    const rollTitle = (text: string) => {
      if (!titleEl) return;
      const enter = () => {
        titleSplit?.revert();
        titleEl.textContent = text;
        titleSplit = new SplitText(titleEl, { type: "words", mask: "words", tag: "span" });
        gsap.set(titleSplit.words, { yPercent: 110 });
        gsap.to(titleSplit.words, {
          yPercent: 0,
          stagger: 0.05,
          ease: "expo.out",
          duration: 0.6,
        });
      };
      if (titleSplit && titleSplit.words.length) {
        gsap.to(titleSplit.words, {
          yPercent: -110,
          stagger: 0.03,
          ease: "power2.in",
          duration: 0.4,
          onComplete: enter,
        });
      } else {
        enter();
      }
    };

    // Click sul titolo → salta alla card della slide corrente (`current` è
    // chiuso su questa closure, sempre aggiornato da `navigate`). Listener
    // nativo (non prop React onClick) perché il testo/tag interno è gestito
    // imperativamente da SplitText, coerente col resto del file.
    const handleTitleClick = () => {
      onOpenPreviewRef.current?.(IMAGES[current].section);
    };
    titleEl?.addEventListener("click", handleTitleClick);

    // ---------- Panoramica verticale lenta (object-position) ----------
    // Trasla `object-position` (non un transform): il box dell'<img> è grande
    // esattamente quanto la slide (vedi .crisp-header__slider-slide-inner),
    // quindi un yPercent lascerebbe un buco — object-position invece pesca
    // dentro il ritaglio "cover" senza mai scoprire il bordo, e non tocca
    // `transform`, quindi non confligge con lo xPercent del wipe (stesso
    // elemento, proprietà diverse). Durata = intervallo dell'autoplay, così la
    // panoramica finisce esattamente quando la slide cambia.
    const PAN_DURATION = AUTOPLAY_MS / 1000;
    const panTweens: Array<gsap.core.Tween | undefined> = new Array(length);
    const startPan = (index: number) => {
      const el = inner[index];
      const img = IMAGES[index];
      if (!el) return;
      panTweens[index]?.kill();
      panTweens[index] = gsap.fromTo(
        el,
        { objectPosition: img.panFrom },
        { objectPosition: img.panTo, duration: PAN_DURATION, ease: "sine.inOut" },
      );
    };
    const resetPan = (index: number) => {
      const el = inner[index];
      const img = IMAGES[index];
      if (!el) return;
      panTweens[index]?.kill();
      panTweens[index] = undefined;
      gsap.set(el, { objectPosition: img.panFrom });
    };
    // Slide iniziale: non passa da `navigate`/wipe (che la triggera on-start per
    // le successive). La si avvia dal `.call` di fine loader (vedi
    // `firePanOnLoad` sopra), non subito: il mount precede il reveal della
    // slide di parecchi secondi, quindi partire qui la farebbe scorrere (ed
    // esaurirsi) mentre è ancora coperta dal loader.
    firePanOnLoad = () => startPan(current);

    // Skip intro (rientro da un progetto): porta la timeline del loader diretta
    // alla fine — stato "pronto" senza animazione — così `onLoaded` (e
    // `firePanOnLoad`, appena assegnato sopra) scattano subito e non si vede
    // l'intro. L'hero è comunque dietro la scheda ripristinata, quindi
    // visivamente il salto è impercettibile.
    if (skipIntroRef.current) {
      tl.progress(1);
    }

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
          rollTitle(IMAGES[current].title);
          startPan(current);
        },
        onComplete() {
          currentSlide.classList.remove("is--current");
          resetPan(previous);
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
      if (titleSplit) {
        gsap.killTweensOf(titleSplit.words); // evita che `enter` scatti post-unmount
        titleSplit.revert();
      }
      thumbHandlers.forEach(([thumb, handler]) =>
        thumb.removeEventListener("click", handler),
      );
      titleEl?.removeEventListener("click", handleTitleClick);
      panTweens.forEach((t) => t?.kill());
      gsap.killTweensOf([...slides, ...inner, ...thumbs, ...isScaleUp]);
      gsap.set(inner, { clearProps: "objectPosition" });
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
                style={{ objectPosition: img.panFrom }}
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
          {/*
          <h1 className="crisp-header__h1">We just love pixels</h1>
          */}
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
              testo lo aggiorna il JS a ogni cambio (init + navigate). È un
              vero <button> (non un <p> con onClick su un div): il click salta
              alla card corrispondente nella home — vedi handleTitleClick.
              Nessun elemento block-level dentro: SplitText qui usa tag "span"
              apposta (di default userebbe <div>, invalido dentro <button>). */}
          <button
            type="button"
            className="crisp-header__p crisp-header__p--link"
            data-slideshow="title"
          >
            {IMAGES[0].title}
          </button>
        </div>
      </div>
    </section>
  );
}
