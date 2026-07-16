"use client";

import { Children, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Scroll virtuale a schede (stile "full-page"): wheel e frecce su/giù cambiano
 * sezione, NON si usa lo scroll nativo, così le transizioni sono a "perfect
 * match" e le pilota GSAP.
 *
 * Macchina a stati, per posizione relativa alla card corrente:
 * - corrente (pos 0):       translateY 0,   scale 1,   bordi flat,  inner 0
 * - passata / dietro (<0):  translateY 0,   scale .9,  rounded,     inner su (-)
 * - sotto / in attesa (>0): translateY 100%, scale .9, rounded,     inner giù (+)
 *
 * Ogni step anima OGNI sezione verso il suo nuovo stato di riposo con una
 * timeline GSAP: la card entrante sale da sotto scalando 0.9→1 e appiattendo i
 * bordi ("intro inversa"), la card uscente arretra 1→0.9 arrotondandosi;
 * l'inner fa parallasse. Lo stato iniziale (per il primo paint, SSR-safe) è
 * dato via CSS in sections.css; da lì in poi i transform li possiede GSAP.
 *
 * Lock: `enabled=false` (loader in corso o menu aperto) ignora wheel/frecce; il
 * lock parte allo step e si rilascia a fine animazione (onComplete), così un
 * gesto lungo da trackpad non fa più doppio-step.
 */

const DURATION = 1.0;
// Dopo un'animazione, ms di rotellina/trackpad FERMI richiesti prima di
// riabilitare lo step. Assorbe la coda di momentum di una scrollata forte, che
// (finendo dopo l'animazione) altrimenti farebbe avanzare di due schede.
const WHEEL_IDLE = 140;
const PARALLAX = 50; // px di sfalsamento dell'inner (< overhang di .section__inner: 60px)
const SCALE_BACK = 0.9;
const RADIUS = "48px";

// Log diagnostico temporaneo — metti a true per riabilitare.
const DEBUG = false;
const log = (...a: unknown[]) => {
  if (DEBUG) console.log("[SS]", ...a);
};

type RestState = {
  yPercent: number;
  scale: number;
  borderRadius: string;
  innerY: number;
};

// Tre stati di riposo di una card. In modalità loop lo stack lineare
// "passato/futuro" non esiste più: a ogni step conta solo la COPPIA in
// transizione, mentre tutte le altre restano parcheggiate BELOW (fuori schermo,
// occluse dalla corrente a scale 1). Bastano quindi tre stati espliciti invece
// della vecchia `resting(pos)`:
// - CURRENT: riempie lo schermo (card a fuoco).
// - BEHIND : dietro la corrente (stessa Y, scala ridotta) — dove finisce la card
//   USCENTE andando avanti, e da dove RIENTRA l'entrante andando indietro.
// - BELOW  : fuori schermo in basso, parcheggio di tutte le non-correnti.
const CURRENT: RestState = { yPercent: 0, scale: 1, borderRadius: "0px", innerY: 0 };
const BEHIND: RestState = { yPercent: 0, scale: SCALE_BACK, borderRadius: RADIUS, innerY: -PARALLAX };
const BELOW: RestState = { yPercent: 100, scale: SCALE_BACK, borderRadius: RADIUS, innerY: PARALLAX };

// z-index ora di proprietà di GSAP (prima statico = indice DOM in JSX). Nel loop
// dev'essere dinamico e direzionale, perché la card entrante può avere indice
// DOM più basso di quella uscente (wrap ultima→prima) e deve comunque comparire
// sopra. Sopra sta sempre la card che COPRE durante lo scorrimento.
const Z_PARKED = 0; // non-correnti, fuori schermo
const Z_BEHIND = 9; // uscente che finisce dietro la corrente (andando avanti)
const Z_CURRENT = 10; // card a fuoco / entrante
const Z_COVER = 11; // uscente che scende COPRENDO l'entrante (andando indietro)

type Props = {
  enabled: boolean;
  // Scheda da cui partire al mount (rientro da un progetto): posiziona subito le
  // sezioni su quell'indice, senza animare le intermedie. Default 0 (hero).
  initialIndex?: number;
  onLockChange?: (locked: boolean) => void;
  onCurrentChange?: (index: number) => void;
  children: React.ReactNode;
};

export default function ScrollSections({
  enabled,
  initialIndex = 0,
  onLockChange,
  onCurrentChange,
  children,
}: Props) {
  const items = Children.toArray(children);
  const count = items.length;

  const [current, setCurrent] = useState(0);

  const sectionEls = useRef<HTMLDivElement[]>([]);
  const innerEls = useRef<HTMLDivElement[]>([]);
  const currentRef = useRef(0);
  const lockedRef = useRef(false);
  // Cooldown post-animazione: assorbe la coda di momentum del trackpad senza far
  // scattare un secondo step. `coolingRef` = animazione finita ma in attesa che
  // la scrollata si fermi; `idleTimerRef` = timer riarmato a ogni wheel.
  const coolingRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabledRef = useRef(enabled);
  const onLockRef = useRef(onLockChange);
  const onCurrentRef = useRef(onCurrentChange);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    enabledRef.current = enabled;
    log("enabled =", enabled);
  }, [enabled]);
  useEffect(() => {
    onLockRef.current = onLockChange;
    onCurrentRef.current = onCurrentChange;
  });

  // Stato iniziale (senza animazione). Normalmente parte da current = 0; al
  // rientro da un progetto (initialIndex > 0) posiziona subito le sezioni su
  // quell'indice e sincronizza stato + callback, saltando le schede intermedie.
  useEffect(() => {
    const sections = sectionEls.current;
    const inners = innerEls.current;
    log("mounted — sections =", sections.length, "| initialIndex =", initialIndex);
    currentRef.current = initialIndex;
    if (initialIndex !== 0) {
      // Salto al mount, una tantum: `current` deve idratare a 0 (uguale al
      // server, dove non c'è sessionStorage) e allinearsi a initialIndex solo
      // qui. Un lazy-init da initialIndex creerebbe un mismatch di hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrent(initialIndex);
      onCurrentRef.current?.(initialIndex);
    }
    sections.forEach((el, i) => {
      const s = i === initialIndex ? CURRENT : BELOW;
      // `y: 0` azzera il canale px che GSAP eredita dal transform CSS iniziale
      // (translateY(100%) → 984px): senza, yPercent non basta a muovere la card.
      // Lo z-index (prima statico in JSX) è ora gestito qui: la corrente sopra,
      // le parcheggiate sotto.
      gsap.set(el, {
        y: 0,
        yPercent: s.yPercent,
        scale: s.scale,
        borderRadius: s.borderRadius,
        zIndex: i === initialIndex ? Z_CURRENT : Z_PARKED,
      });
      if (inners[i]) gsap.set(inners[i], { y: s.innerY });
    });
    const sectionsWrap = sections[0]?.parentElement;
    // Micro fade-in al rientro: la scheda ripristinata non compare di scatto.
    // fromTo con destinazione ESPLICITA (autoAlpha:1): con `from` GSAP cattura
    // il valore corrente come target e, sotto il doppio-mount di StrictMode, un
    // secondo tween catturerebbe un'opacità già abbassata → .sections resterebbe
    // semi-trasparente (velo bianco-caldo del body sotto). fromTo lo evita.
    if (initialIndex !== 0 && sectionsWrap) {
      gsap.fromTo(
        sectionsWrap,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
      );
    }
    log(
      "ALTEZZE → innerHeight =",
      window.innerHeight,
      "| .sections =",
      sectionsWrap?.offsetHeight,
      "| .section[] =",
      sections.map((el) => el.offsetHeight),
    );
    return () => {
      tlRef.current?.kill();
      // Ripulisci anche il wrapper .sections dal fade-in (tween + opacity/
      // visibility inline): altrimenti un rimontaggio potrebbe ereditarne un
      // valore intermedio e lasciare il contenuto velato.
      if (sectionsWrap) {
        gsap.killTweensOf(sectionsWrap);
        gsap.set(sectionsWrap, { clearProps: "all" });
      }
      gsap.set([...sections, ...inners].filter(Boolean), { clearProps: "all" });
    };
    // initialIndex è stabile (deciso una volta al mount di UnderlayNav): di fatto
    // questo effetto resta un mount unico.
  }, [initialIndex]);

  useEffect(() => {
    // Riapre lo step solo dopo WHEEL_IDLE ms senza nuovi eventi: ogni wheel in
    // cooldown lo riarma, così un unico gesto lungo resta un solo step.
    const scheduleUnlock = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        idleTimerRef.current = null;
        coolingRef.current = false;
        lockedRef.current = false;
        onLockRef.current?.(false);
      }, WHEEL_IDLE);
    };

    const step = (dir: number) => {
      const from = currentRef.current;
      if (!enabledRef.current || lockedRef.current) return;
      // Loop circolare: niente più clamp agli estremi. Con ≥2 sezioni `next` è
      // sempre diverso da `from`, quindi non esistono più "bordi" fermi.
      if (count < 2) return;
      const next = (from + dir + count) % count;

      log(`step GO ${from} → ${next} (dir=${dir}, loop)`);
      lockedRef.current = true;
      onLockRef.current?.(true);
      currentRef.current = next;
      setCurrent(next);
      onCurrentRef.current?.(next);

      const sections = sectionEls.current;
      const inners = innerEls.current;
      const forward = dir > 0;

      // z-index della coppia: sopra va la card che COPRE durante lo scorrimento.
      // Avanti → l'entrante sale sopra l'uscente. Indietro → l'uscente scende
      // sopra l'entrante (che si rivela dietro). Le altre restano Z_PARKED.
      sections.forEach((el, i) => {
        const z =
          i === next ? Z_CURRENT : i === from ? (forward ? Z_BEHIND : Z_COVER) : Z_PARKED;
        gsap.set(el, { zIndex: z });
      });

      // Andando INDIETRO l'entrante deve comparire da BEHIND (dietro la
      // corrente), ma è parcheggiata BELOW: la riposiziono istantaneamente
      // dietro l'uscente — che copre lo schermo ed è sopra (Z_COVER), quindi il
      // salto è occluso. Andando AVANTI parte già da BELOW e sale: nessun pre-set.
      if (!forward) {
        gsap.set(sections[next], {
          y: 0,
          yPercent: BEHIND.yPercent,
          scale: BEHIND.scale,
          borderRadius: BEHIND.borderRadius,
        });
        if (inners[next]) gsap.set(inners[next], { y: BEHIND.innerY });
      }

      // Dove finisce l'uscente: dietro (avanti) o giù fuori schermo (indietro).
      const out = forward ? BEHIND : BELOW;

      tlRef.current?.kill();
      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: "power3.inOut" },
        onStart: () => log(`anim START → ${next}`),
        onComplete: () => {
          // Parcheggia tutte le non-correnti BELOW (istantaneo, occluso dalla
          // corrente a scale 1): ogni step riparte così da uno stato noto e la
          // corrente resta sopra tutto.
          sections.forEach((el, i) => {
            if (i === next) return;
            gsap.set(el, {
              y: 0,
              yPercent: BELOW.yPercent,
              scale: BELOW.scale,
              borderRadius: BELOW.borderRadius,
              zIndex: Z_PARKED,
            });
            if (inners[i]) gsap.set(inners[i], { y: BELOW.innerY });
          });
          gsap.set(sections[next], { zIndex: Z_CURRENT });
          // Non sblocca subito: entra in cooldown e avvia il timer di idle. Se
          // il momentum del trackpad continua, onWheel lo riarma e l'unlock
          // slitta finché la scrollata non è davvero ferma.
          coolingRef.current = true;
          scheduleUnlock();
        },
        onInterrupt: () => log(`anim INTERRUPTED (killed) mentre andava a ${next}`),
      });

      // Entrante → CURRENT.
      tl.to(
        sections[next],
        { yPercent: CURRENT.yPercent, scale: CURRENT.scale, borderRadius: CURRENT.borderRadius },
        0,
      );
      if (inners[next]) tl.to(inners[next], { y: CURRENT.innerY, ease: "power2.inOut" }, 0);

      // Uscente → BEHIND o BELOW.
      tl.to(
        sections[from],
        { yPercent: out.yPercent, scale: out.scale, borderRadius: out.borderRadius },
        0,
      );
      if (inners[from]) tl.to(inners[from], { y: out.innerY, ease: "power2.inOut" }, 0);

      tlRef.current = tl;
    };

    const onWheel = (e: WheelEvent) => {
      if (!enabledRef.current || Math.abs(e.deltaY) < 2) return;
      if (lockedRef.current) {
        // In cooldown (animazione finita) il momentum residuo rimanda l'unlock;
        // durante l'animazione non c'è ancora nessun timer da riarmare.
        if (coolingRef.current) scheduleUnlock();
        return;
      }
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!enabledRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        log(`key ${e.key}`);
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        log(`key ${e.key}`);
        step(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [count]);

  return (
    <div className="sections">
      {items.map((child, i) => (
        <div
          className="section"
          key={i}
          ref={(el) => {
            if (el) sectionEls.current[i] = el;
          }}
          aria-hidden={i !== current}
          // z-index è gestito da GSAP (vedi mount/step): qui solo i pointer-events.
          style={{ pointerEvents: i === current ? "auto" : "none" }}
        >
          <div
            className="section__inner"
            ref={(el) => {
              if (el) innerEls.current[i] = el;
            }}
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
