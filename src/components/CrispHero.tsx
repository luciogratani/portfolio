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
const IMAGES = [
  { src: "/hero/imgi_1_cover.jpg", alt: "Immagine hero 1" },
  { src: "/hero/imgi_2_cover.jpg", alt: "Immagine hero 2" },
  { src: "/hero/imgi_5_cover.jpg", alt: "Immagine hero 3" },
  { src: "/hero/imgi_6_cover.jpg", alt: "Immagine hero 4" },
  { src: "/hero/imgi_7_cover.jpg", alt: "Immagine hero 5" },
  { src: "/hero/imgi_8_cover.jpg", alt: "Immagine hero 6" },
  { src: "/hero/imgi_9_cover.jpg", alt: "Immagine hero 7" },
];

// Striscia del loader: come nell'originale Osmo, è una ROTAZIONE dell'ordine
// delle slide che porta IMAGES[0] (l'immagine che scala a schermo pieno) al
// centro esatto della striscia, così coincide con la prima slide dello slideshow.
const HERO_IMG = IMAGES[0];
const LOADER_ORDER = (() => {
  const mid = Math.floor(IMAGES.length / 2); // indice centrale
  return [...IMAGES.slice(IMAGES.length - mid), ...IMAGES.slice(0, IMAGES.length - mid)];
})();

/**
 * Crisp Loading Animation — port del pen Osmo (https://osmo.supply/).
 * Fa da loader (a durata fissa, "fake") e poi diventa lo slideshow-hero.
 * Chiama `onLoaded` a fine timeline: è l'aggancio che sblocca il menu.
 */
export default function CrispHero({ onLoaded }: { onLoaded?: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const onLoadedRef = useRef(onLoaded);
  useEffect(() => {
    onLoadedRef.current = onLoaded;
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
      tl.fromTo(
        isScaleUp,
        { width: "10em", height: "10em" },
        { width: "100vw", height: "100dvh", duration: 2 },
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

    let current = 0;
    const length = slides.length;
    let animating = false;
    const animationDuration = 1.5;
    const slideshowTimelines: gsap.core.Timeline[] = [];

    slides.forEach((slide, i) => slide.setAttribute("data-index", String(i)));
    thumbs.forEach((thumb, i) => thumb.setAttribute("data-index", String(i)));
    slides[current]?.classList.add("is--current");
    thumbs[current]?.classList.add("is--current");

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
      };
      thumb.addEventListener("click", handler);
      thumbHandlers.push([thumb, handler]);
    });

    /* ---------- Cleanup (anche per il doppio-mount di StrictMode in dev) ---------- */
    return () => {
      tl.kill();
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
          <p className="crisp-header__p">
            Crisp Loading Animation by{" "}
            <a
              href="https://www.osmo.supply?utm_source=codepen&utm_medium=pen&utm_campaign=crisp-loading-animation"
              target="_blank"
              rel="noreferrer"
            >
              Osmo
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
