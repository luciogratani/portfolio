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

function resting(pos: number): RestState {
  if (pos === 0)
    return { yPercent: 0, scale: 1, borderRadius: "0px", innerY: 0 };
  if (pos < 0)
    return { yPercent: 0, scale: SCALE_BACK, borderRadius: RADIUS, innerY: -PARALLAX };
  return { yPercent: 100, scale: SCALE_BACK, borderRadius: RADIUS, innerY: PARALLAX };
}

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
      const s = resting(i - initialIndex);
      // `y: 0` azzera il canale px che GSAP eredita dal transform CSS iniziale
      // (translateY(100%) → 984px): senza, yPercent non basta a muovere la card.
      gsap.set(el, {
        y: 0,
        yPercent: s.yPercent,
        scale: s.scale,
        borderRadius: s.borderRadius,
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
      const next = Math.min(Math.max(from + dir, 0), count - 1);
      if (next === from) {
        log(`step EDGE dir=${dir} current=${from} (già al limite, nessun movimento)`);
        return;
      }

      log(`step GO ${from} → ${next} (dir=${dir})`);
      lockedRef.current = true;
      onLockRef.current?.(true);
      currentRef.current = next;
      setCurrent(next);
      onCurrentRef.current?.(next);

      tlRef.current?.kill();
      const tl = gsap.timeline({
        defaults: { duration: DURATION, ease: "power3.inOut" },
        onStart: () => log(`anim START → ${next}`),
        onComplete: () => {
          const el = sectionEls.current[next];
          const r = el?.getBoundingClientRect();
          log(
            `anim DONE → current=${next} | rect top=${r?.top.toFixed(0)} h=${r?.height.toFixed(0)} | transform="${el?.style.transform}"`,
          );
          // Non sblocca subito: entra in cooldown e avvia il timer di idle. Se
          // il momentum del trackpad continua, onWheel lo riarma e l'unlock
          // slitta finché la scrollata non è davvero ferma.
          coolingRef.current = true;
          scheduleUnlock();
        },
        onInterrupt: () => log(`anim INTERRUPTED (killed) mentre andava a ${next}`),
      });
      sectionEls.current.forEach((el, i) => {
        const s = resting(i - next);
        log(
          `  sec[${i}] target yP=${s.yPercent} scale=${s.scale} | el.tag=${el?.className} sameAsInner=${el === innerEls.current[i]}`,
        );
        tl.to(
          el,
          { yPercent: s.yPercent, scale: s.scale, borderRadius: s.borderRadius },
          0,
        );
        if (innerEls.current[i]) {
          tl.to(innerEls.current[i], { y: s.innerY, ease: "power2.inOut" }, 0);
        }
      });
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
          style={{ zIndex: i, pointerEvents: i === current ? "auto" : "none" }}
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
