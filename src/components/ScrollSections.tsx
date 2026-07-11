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
  onLockChange?: (locked: boolean) => void;
  onCurrentChange?: (index: number) => void;
  children: React.ReactNode;
};

export default function ScrollSections({
  enabled,
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

  // Stato iniziale coerente con current = 0 (senza animazione).
  useEffect(() => {
    const sections = sectionEls.current;
    const inners = innerEls.current;
    log("mounted — sections =", sections.length);
    sections.forEach((el, i) => {
      const s = resting(i);
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
      gsap.set([...sections, ...inners].filter(Boolean), { clearProps: "all" });
    };
  }, []);

  useEffect(() => {
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
          lockedRef.current = false;
          onLockRef.current?.(false);
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
