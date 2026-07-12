# Handoff — Port SFCC (card 3) + stato progetto portfolio

> Nota di ripresa lavori. Scritta a fine sessione (crediti in esaurimento).
> Progetto: `/Users/lucio/Desktop/Simone/portfolio/web` — Next 16.2.10, React 19.2.4,
> Tailwind v4, **pnpm** (NON npm), typecheck+eslint attivi su `pnpm build`.
> **Il dev server lo lancia SOLO l'utente** (non eseguire `pnpm dev`). Verifica con `pnpm build` + `pnpm lint`.

## Contesto generale
Portfolio a schede (scroll verticale full-page, vedi `src/components/ScrollSections.tsx` +
`src/components/UnderlayNav.tsx`). Ogni card mostra un progetto: un **mockup** in uno schermo/monitor
dentro la card + una **route reale** `/projects/<slug>` con l'esperienza completa.

- **Card 1**: hero slideshow (`CrispHero`).
- **Card 2 = GiGi** (fatta, committata): route `/projects/gigi` (landing energy drink) + mockup
  `ScreenCard`/`DemoSite` (monitor Studio Display, sito congelato 1600×900). Template sorgente:
  `portfolio/repo/modern-gen-z-energy-drink-landing-page-...`.
- **Card 3 = SFCC** (IN CORSO): route `/projects/sfcc` (e-commerce arredamento). Template sorgente:
  `/Users/lucio/Desktop/Simone/portfolio/repo/v0-sfcc-ecommerce-template`.
- Card 4/5: ancora placeholder `.demo-card` in `UnderlayNav`.

Ordine di lavoro deciso per card 3 (INVERSO rispetto a card 2): **prima la route live, poi il mockup**.

## Stato commit
- Ultimo commit/push: `683b855` (return-to-last-card + fix scroll). Branch `main`, allineato con origin fino a lì.
- **Non committato** = tutta la Fase 1 SFCC (vedi sotto). I file sono su disco (non persi). Build+lint GREEN.
  Da valutare se committare (l'utente controlla i commit).

---

## FASE 1 — Route `/projects/sfcc` (home decoupled) — ✅ FATTA (build+lint green)

Scelte utente: **home decoupled** con **mock data**, font **Geist/Geist Mono**.

### Cosa è stato creato
- `src/app/projects/sfcc/{layout,page}.tsx` + `sfcc.css` (wrapper `.sfcc-root`, font, bg/testo).
- `src/components/sfcc/` (flatten, import risistemati): `page-layout`, `footer`, `home-sidebar`,
  `shop-links`, `product-sidebar-links`, `logo-svg`, `latest-product-card`, `featured-product-label`,
  `badge`, `button`, `add-to-cart` (**STUB**: bottone "Cart disabled", niente carrello — DA SOSTITUIRE in Fase A).
- `src/lib/sfcc/`:
  - `types.ts` — tipi ridotti SDK-free (Product, Collection, Image, Money, ProductVariant, ProductOption, SEO, NavItem).
  - `data.ts` — shim decoupled: `getCollections()`, `getCollectionProducts({collection})` sui mock (replica il ramo mock di `lib/sfcc/index.ts` del template). ROOT_CATEGORY="joyco-root".
  - `mock-products.ts` (23 prodotti, copiati) — `import ... from "./types"`.
  - `mock-collections.ts` (copiati).
  - `constants.ts` — `CONTACT_LINKS`.
  - `utils.ts` — `cn` (clsx+tailwind-merge) + `getLabelPosition`. **Manca `formatPrice`** (serve al carrello, vedi Fase A).
- `src/fonts/sfcc-fonts.ts` — Geist/Geist_Mono (`--font-geist-sans`/`--font-geist-mono`).
- **Deps aggiunte (pnpm)**: `clsx`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/react-slot`.
- **Tema Tailwind v4** in `src/app/globals.css`: blocco `@theme` (token colore shadcn: background/foreground/
  primary/secondary/muted/accent/border/input/ring/destructive/card, in `hsl(...)` light) + spacing custom
  (`--spacing-sides:24px`, `--spacing-modal-sides:16px`, `--spacing-top-spacing:144px` [valore desktop],
  `--spacing-fold:100svh`) + `@utility base-grid` / `base-gap`. Abilita le utility usate SOLO da sfcc
  (`bg-background`, `text-foreground`, `p-sides`, `gap-sides`, `h-fold`, `pt-top-spacing`, `base-grid`…).
- `next.config.ts`: aggiunti `remotePatterns` host **Salesforce sandbox** (`edge.disstg.commercecloud.salesforce.com`,
  `zylq-002.dx.commercecloud.salesforce.com`) per le immagini prodotto remote.

### Note/rischi Fase 1
- Immagini prodotto = CDN sandbox Salesforce (host whitelistato). Se lento/irraggiungibile non caricano →
  per il mockup (Fase 2) conviene scaricarne alcune in `public/sfcc/`.
- L'utente deve ancora **verificare visivamente** `/projects/sfcc` in dev (non l'ha ancora confermato).

---

## DECISIONE PRESA A FINE SESSIONE — espandere lo scope
L'utente vuole: **header originale INTEGRALE + carrello FUNZIONANTE + viste home/featured/shop all**,
"lavorando con solo ~3 prodotti se possibile". Product detail (`/product/[handle]`): **da rimandare**
(i link prodotto per ora non aprono il dettaglio, o puntano allo shop). Approccio esecutivo NON ancora
scelto (la domanda è stata interrotta dal fine-crediti) — proporre di nuovo: **a fasi inline** (consigliato)
vs subchat one-shot.

Il "logo in alto a sx non renderizza" = l'header (con logo) è stato OMESSO nella Fase 1. Recuperarlo è il primo passo.

### FATTIBILITÀ CARRELLO — ✅ confermata
`components/cart/cart-context.tsx` (template) usa **`useOptimistic` + `cartReducer` interamente client-side**.
Le server action (`cart/actions.ts`: addItem/removeItem/updateItemQuantity/createCartAndSetCookie/redirectToCheckout)
servono solo a sincronizzare con SFCC. **Lo stato visibile del carrello (add/rimuovi/quantità/totali) è calcolato
in locale.** → Carrello mock funzionante SENZA SDK: **stubbare le server action come no-op** (return success/undefined)
e far sì che `AddToCart` sia abilitato (l'attuale stub è disabilitato).
- Nota: `AddToCart` originale disabilita se `mode==="mock"`. Strategia: passare `mode="live"` al `CartProvider`
  (o adattare il check) così il bottone è attivo; le action stubbate "riescono" e l'`optimisticCart` si aggiorna.
  I prodotti mock hanno `variants:[]` → `hasNoVariants` → `getBaseProductVariant` → `resolvedVariant` valido → abilitato.

---

## FASE A (prossimo passo) — Header integrale + carrello mock funzionante (sulla home attuale)

Componenti da portare in `src/components/sfcc/` (adattando import come già fatto, path `@/lib/sfcc/*`):
- `components/layout/header/index.tsx` → `Header` (logo + navItems [home /projects/sfcc, featured, shop all] + `CartModal` + `MobileMenu`). **Attenzione**: i `navItems.href` puntano a `/`, `/shop/top-seller`, `/shop` → riscriverli sotto `/projects/sfcc/...` o adattare il basePath.
- `components/layout/header/mobile-menu.tsx` (motion/react, Button, SidebarLinks, ShopLinks).
- `components/layout/header/logo-svg.tsx` (già portato).
- `components/cart/modal.tsx` `CartModal` (motion, Button, `CartItemCard`, `formatPrice`, actions → STUB).
- `components/cart/cart-context.tsx` (client, portare quasi as-is).
- `components/cart/cart-item.tsx` (`ColorSwatch` da `ui/color-picker`, `useProductImages` da `products/variant-selector`, `formatPrice`, `createUrl`+`getColorHex` da utils, `DEFAULT_OPTION`).
- `components/cart/delete-item-button.tsx`, `edit-item-quantity-button.tsx` (useActionState + action stub).
- **Stub** `src/components/sfcc/cart-actions.ts` (`"use server"` o semplici funzioni no-op) al posto di `components/cart/actions.ts`.
- Aggiungere a `src/lib/sfcc/utils.ts`: `formatPrice`, e (per cart-item) `createUrl` + `getColorHex` + `COLOR_MAP` (da `lib/constants.ts` del template). Aggiungere `DEFAULT_OPTION` alle costanti.
- Tipi extra in `types.ts`: `Cart`, `CartItem`, `CartProduct`, `SalesforceCart`, `SFCCMode`, `Connection`, `Edge` (già nel template types.ts; portarli SDK-free — la parte SDK di `SalesforceCart.paymentInstruments` può essere rimossa/semplificata).
- **Route layout** `src/app/projects/sfcc/layout.tsx`: avvolgere `children` in `<CartProvider cartPromise={Promise.resolve(emptyCart)} mode="live">` e renderizzare `<Header collections={await getCollections()} />`. (Layout può restare server component che fa l'await; Header è client.)
- Deps pnpm probabilmente necessarie: `@radix-ui/react-dialog` e/o `@radix-ui/react-tooltip` (se CartModal/tooltip li usano — VERIFICARE aprendo modal.tsx e ui/tooltip, ui/dialog). `ui/color-picker` va aperto per capire cosa tira. `motion/react` = pacchetto `motion` (il template usa sia `framer-motion` che `motion`; noi abbiamo `framer-motion`. `motion/react` è il pacchetto `motion` → potrebbe servire `pnpm add motion`, oppure riscrivere gli import a `framer-motion`).

Fix TS/lint attesi (come per gigi): `type:"spring" as const`, cast `ease` a tupla, `useActionState` con tipi `any`→tipizzare o eslint-disable, `no-img-element`, apostrofi/escape, var inutilizzate, rimozione `"use cache"`/SDK.

## FASE B — viste featured + shop all
- Pagine `src/app/projects/sfcc/shop/page.tsx` (shop all) e `.../shop/[collection]/page.tsx` (featured = collection `top-seller`).
- Componenti `app/shop/components/*` (product-list, product-card, filters color/category, results-controls, mobile-filters, providers/hooks) + `app/shop/providers/products-provider.tsx`.
- Deps: **`nuqs`** (query-state dei filtri) + `NuqsAdapter` nel layout sfcc; altri `ui/*` (select/slider/sheet).
- Data shim `src/lib/sfcc/data.ts`: aggiungere `getCollection(handle)`, e una `searchProducts`/`getProducts` mock (filtri per categoria/colore) — replicare la logica mock del template.
- **Catalogo ridotto a ~3 prodotti**: trimmare `mock-products.ts` a 3 (assicurarsi che restino ≥1 con `categoryId:"top-seller"` per non svuotare la home/featured). Attualmente: 6 seats, 6 lamps, 4 rugs, 3 top-seller, 2 pillows, 2 miscellaneous.

## FASE 2 (mockup card 3) — DOPO le route
- Replicare `ScreenCard`/`DemoSite` (vedi card 2) per SFCC: `SfccScreenCard`/`SfccDemoSite`, caption con reveal SplitText + "Visit demo →" verso `/projects/sfcc`, clickable → route con `markReturnFromProject()` (da `src/lib/return-nav.ts`), integrare in `UnderlayNav` al posto del placeholder index 2 (attuale `.demo-card` verde "Gestionale"). `active={currentSection === 2 && !scrollLocked}`.
- **DECISIONE APERTA (rimandata): asset monitor per card 3.** Candidati valutati:
  - Studio Display card 2 (`public/hero/hero1-j5-bg.jpg`): frontale/piatto, coord schermo note (`.screen-card__screen` left 19.70% top 21.58% w 61.52% h 46.02%) → tecnica identica ma monitor uguale alla card 2 (ripetitivo).
  - `public/hero/tecnoarreda.it.jpg`: laptop **angolato in prospettiva** → servirebbe mappatura 3D CSS (non stessa tecnica).
  - `public/hero/dashboard.shadcnspace.com_(iPad Pro).png`: è uno **screenshot lungo di dashboard**, NON una cornice-dispositivo → non usabile come monitor.
  - Oppure l'utente fornisce un nuovo mockup frontale/piatto. → Da decidere prima della Fase 2; calibrare le coord `.screen-card__screen`.

## File blueprint di riferimento (nostro progetto)
- Mockup card 2: `src/components/ScreenCard.tsx`, `src/components/DemoSite.tsx`, `src/app/demo-site.css`, `src/app/sections.css` (`.screen-card*`).
- Route pattern: `src/app/(portfolio)/layout.tsx` (isolamento route-group), `src/app/projects/gigi/{layout,page}.tsx`, `.../gigi.css`.
- Ritorno scheda: `src/lib/return-nav.ts` (`saveCurrentSection`, `markReturnFromProject`, `peekReturn`, `clearReturn`) + `UnderlayNav.tsx` (placeholder card 3 index 2, ~righe 408-413).

## Template SFCC — file chiave (sorgente)
`/Users/lucio/Desktop/Simone/portfolio/repo/v0-sfcc-ecommerce-template/`
- `app/{layout,page}.tsx`, `app/globals.css` (token+utility), `app/shop/**`, `app/product/[handle]/**`, `next.config.mjs`.
- `components/layout/header/**`, `components/cart/**`, `components/products/**`, `components/ui/**`.
- `lib/sfcc/{index.ts (SDK+use cache), types.ts, mock/{products,collections}.ts, constants.ts}`, `lib/{utils,constants,types}.ts`.
- Config template: `ignoreBuildErrors:true`, `ignoreDuringBuilds:true`, `images.unoptimized:true` → typecheck/lint MAI girati là (aspettarsi errori da sistemare da noi).
