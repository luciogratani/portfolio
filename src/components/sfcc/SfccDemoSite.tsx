"use client";

// Mini-sito SFCC leggero e "live" (non più un wallpaper statico), pensato per
// vivere dentro lo schermo obliquo di SfccScreenCard: design fisso 1600×900,
// poi deformato via matrix3d dal genitore. NON è la route reale
// /projects/sfcc: niente provider cart/view-switch, niente routing interno.
//
// Vita del negozio (tutto gated su `active`, si resetta quando la card esce di
// fuoco così si rigioca al rientro):
// 1. Auto-browse: la griglia scorre in loop senza cuciture (CSS marquee).
// 2. Hover: pausa lo scroll (CSS `:hover` → animation-play-state) e la card
//    sotto il puntatore fa zoom immagine + reveal pill "Add to cart".
// 3. Ken-burns: micro-zoom lento e sfasato sulle immagini (CSS, elemento
//    distinto dallo zoom-hover per non litigare sui transform).
// 4. Cart: badge FISSO "1" sull'icona (carrello con un articolo dentro).
//    Statico, nessuno stato/animazione.
// 5. Nav ciclante: l'item attivo tra home/featured/shop all cambia ogni ~4s
//    con un underline che slitta (React state + underline misurato via ref).
//
// I loop CSS partono DOPO l'entrance: uno stato `live` viene acceso ~0.8s dopo
// che la card diventa attiva (classe `.is-live` sul root) e spento subito
// all'uscita; i loop CSS e l'interval del nav sono gated su `live`.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Image from "next/image";
import { geistSans, geistMono } from "@/fonts/sfcc-fonts";
import { LogoSvg } from "./logo-svg";
import { mockProducts } from "@/lib/sfcc/mock-products";
import { formatPrice } from "@/lib/sfcc/utils";
import { markReturnFromProject } from "@/lib/return-nav";

const PROJECT_ROUTE = "/projects/sfcc";

const NAV_ITEMS = ["home", "featured", "shop all"];

// Prodotti unici (il catalogo ha 3 duplicati "top-seller" per la route reale,
// qui non servono): 12 id distinti così il marquee riempie più della viewport
// visibile e il loop è ricco/vario.
const products = mockProducts
  .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
  .slice(0, 12);

function ProductTile({
  product,
  index,
}: {
  product: (typeof products)[number];
  index: number;
}) {
  return (
    <div className="sfcc-card">
      <div className="sfcc-card__media">
        {/* Wrapper dello zoom-hover: transform SEPARATO da quello del ken-burns
            sull'<img> sotto, così i due non si sovrascrivono. */}
        <div className="sfcc-card__zoom">
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes="360px"
            className="sfcc-card__img object-cover"
            // Sfasa il ken-burns per card così non pulsano all'unisono.
            style={{ animationDelay: `${(index % 6) * -1.7}s` }}
          />
        </div>

        {/* Overlay hover (replica lo stato di src/components/sfcc/product-card):
            pannello in basso con titolo/prezzo + pill "Add to cart". */}
        <div className="sfcc-card__overlay">
          <div className="sfcc-card__overlay-row">
            <p className="sfcc-card__overlay-title">{product.title}</p>
            <p className="sfcc-card__overlay-price">
              {formatPrice(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode,
              )}
            </p>
          </div>
          <span className="sfcc-card__addbtn">Add to cart</span>
        </div>
      </div>

      <div className="sfcc-card__caption">
        <p className="sfcc-card__title">{product.title}</p>
        <p className="sfcc-card__price">
          {formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode,
          )}
        </p>
      </div>
    </div>
  );
}

export default function SfccDemoSite({ active }: { active: boolean }) {
  const router = useRouter();
  const openProject = () => {
    markReturnFromProject();
    router.push(PROJECT_ROUTE);
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // `live` = loop del negozio accesi (dopo l'entrance). Spento subito quando la
  // card esce di fuoco, così tutti i loop CSS/React si resettano e ripartono.
  const [live, setLive] = useState(false);

  // Nav attivo ciclante (React state) + underline misurato che slitta.
  const [navIdx, setNavIdx] = useState(0);
  const navRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underline, setUnderline] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // Entrance (come card 2): header, badge e griglia entrano con stagger quando
  // `active`. GSAP tocca opacity/y del wrapper marquee, mentre lo scroll CSS
  // vive sul track figlio: nessun conflitto di transform.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = [
      headerRef.current,
      badgeRef.current,
      marqueeRef.current,
    ].filter((el): el is HTMLDivElement => el !== null);

    const ctx = gsap.context(() => {
      if (!active) {
        gsap.set(targets, { opacity: 0, y: 24 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 24 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
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

  // Nav ciclante: interval gated su `live`; torna a "home" (nel cleanup) quando
  // si spegne.
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setNavIdx((i) => (i + 1) % NAV_ITEMS.length);
    }, 4000);
    return () => {
      clearInterval(id);
      setNavIdx(0);
    };
  }, [live]);

  // Underline che slitta: misura l'item attivo e sposta/ridimensiona la barra.
  useEffect(() => {
    const el = navRefs.current[navIdx];
    if (el) setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
  }, [navIdx, live]);

  return (
    <div
      ref={rootRef}
      className={`sfcc-demo-site ${geistSans.variable} ${geistMono.variable} ${
        live ? "is-live" : ""
      }`}
      onClick={openProject}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      <div className="absolute inset-0 bg-background" />

      {/* Header */}
      <div
        ref={headerRef}
        className="relative z-10 flex items-center justify-between px-10 py-7"
      >
        <Link
          href={PROJECT_ROUTE}
          onClick={markReturnFromProject}
          className="text-foreground"
        >
          <LogoSvg className="h-6 w-auto" />
        </Link>

        <nav className="sfcc-nav">
          {NAV_ITEMS.map((label, i) => (
            <button
              key={label}
              type="button"
              ref={(el) => {
                navRefs.current[i] = el;
              }}
              className={`sfcc-nav__item ${i === navIdx ? "is-active" : ""}`}
            >
              {label}
            </button>
          ))}
          <span
            className="sfcc-nav__underline"
            style={{ left: underline.left, width: underline.width }}
          />
        </nav>

        <div className="sfcc-cart">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className="text-foreground"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6h2l1.6 9.6a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.7L20 8H6"
            />
            <circle cx="9" cy="21" r="1" fill="currentColor" />
            <circle cx="17" cy="21" r="1" fill="currentColor" />
          </svg>
          {/* Badge fisso: un articolo già nel carrello. */}
          <span className="sfcc-cart__badge">1</span>
        </div>
      </div>

      {/* Badge "latest drop" */}
      <div ref={badgeRef} className="relative z-10 px-10 shrink-0">
        <span className="inline-flex items-center rounded-md border border-foreground/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/60">
          Latest drop
        </span>
      </div>

      {/* Griglia prodotti in auto-browse (marquee verticale, loop seamless). */}
      <div ref={marqueeRef} className="sfcc-marquee">
        <div className="sfcc-marquee__track">
          {/* Due copie identiche: il track scorre -50% in loop lineare. Il
              margin-bottom = gap su ogni copia rende la cucitura uniforme. */}
          {[0, 1].map((copy) => (
            <div
              className="sfcc-marquee__copy"
              key={copy}
              aria-hidden={copy === 1}
            >
              {products.map((product, index) => (
                <ProductTile
                  key={`${copy}-${product.id}`}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
