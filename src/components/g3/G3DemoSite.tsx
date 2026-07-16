"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { markReturnFromProject } from "@/lib/return-nav";
import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis } from "recharts";
import {
  Bell,
  Building2,
  ChevronsUpDown,
  FileEdit,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Plus,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import { demoSans, demoMono } from "@/fonts/demo-site-fonts";

// Larghezza di design del layout fisso del gestionale (vedi g3-demo-site.css):
// serve per calcolare lo scale factor in JS, identico al pattern di DemoSite.
const DESIGN_W = 1600;

/**
 * G3DemoSite — ricostruzione leggera e "congelata" del gestionale/backoffice
 * G3 Modena (l'app `admin` del monorepo: sidebar shadcn + Dashboard con
 * recharts), pensata per vivere dentro lo schermo dello Studio Display di
 * G3ScreenCard — STESSO meccanismo di ScreenCard/DemoSite (card 2 "GiGi").
 *
 * Layout desktop FISSO 1600×900 scalato via `transform: scale()` col fattore
 * calcolato in JS (ResizeObserver sul box schermo), non responsive al viewport.
 * Nessuno scroll interno, nessun dato reale: valori statici plausibili. Le
 * animazioni recharts sono spente; l'ingresso lo guida un piccolo timeline GSAP
 * pilotato da `active` (parte col power-on dello schermo).
 */

// ----- Dati statici (plausibili per G3 Modena — staffing/hospitality) -----
const TRAFFIC = [
  { m: "Feb", visite: 4200, cta: 620 },
  { m: "Mar", visite: 5100, cta: 780 },
  { m: "Apr", visite: 4800, cta: 710 },
  { m: "Mag", visite: 6400, cta: 1020 },
  { m: "Giu", visite: 7300, cta: 1180 },
  { m: "Lug", visite: 8200, cta: 1340 },
];

const SORGENTI = [
  { name: "Instagram", value: 38, color: "var(--c1)" },
  { name: "Diretto", value: 26, color: "var(--c2)" },
  { name: "Google", value: 21, color: "var(--c3)" },
  { name: "Referral", value: 15, color: "var(--c4)" },
];

const MESSAGGI = [
  { n: "Giulia Ferrari", m: "Disponibilità per turno serale weekend?", t: "8 min", tag: "new", c: "var(--c1)" },
  { n: "Marco Bianchi", m: "Candidatura cameriere sede Modena", t: "34 min", tag: "new", c: "var(--c3)" },
  { n: "Sara Conti", m: "Richiesta preventivo catering evento", t: "1 h", tag: "open", c: "var(--c2)" },
  { n: "Luca Romano", m: "Info posizione aperta banconista", t: "3 h", tag: "open", c: "var(--c5)" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

const PROJECT_ROUTE = "/projects/g3";

export default function G3DemoSite({ active }: { active: boolean }) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);

  // Tutta la superficie schermo è un teaser cliccabile → gestionale reale
  // (come DemoSite di GiGi e TaskoDemoSite). Marca il ritorno così il tasto
  // "indietro" riporta a questa scheda saltando hero + intro.
  const openProject = () => {
    markReturnFromProject();
    router.push(PROJECT_ROUTE);
  };

  // Scale factor in JS (come DemoSite): scale() vuole un numero unitless non
  // ricavabile da unità cq in CSS. Osserviamo il resize del box schermo.
  useEffect(() => {
    const root = rootRef.current;
    const parent = root?.parentElement;
    if (!root || !parent) return;

    const update = () => {
      root.style.setProperty("--g3-scale", String(parent.clientWidth / DESIGN_W));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  // Ingresso: stagger di sidebar-items, header, stat cards e chart cards quando
  // lo schermo si accende. Da spento resta nascosto, pronto a rigiocare.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-g3-anim]");
      if (!active) {
        gsap.set(cards, { opacity: 0, y: 22 });
        return;
      }
      gsap.set(cards, { opacity: 0, y: 22 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.15,
      });
    }, root);

    return () => ctx.revert();
  }, [active]);

  return (
    <div
      ref={rootRef}
      className={`g3-demo ${demoSans.variable} ${demoMono.variable}`}
      /* Interattivo (click + hover) solo a schermo acceso (come gli altri demo):
         da spento (opacity 0) niente click/hover fantasma. */
      onClick={openProject}
      style={{ pointerEvents: active ? "auto" : "none" }}
      aria-hidden="true"
    >
      {/* ---------------- Sidebar ---------------- */}
      <aside className="g3-sb">
        <div className="g3-brand" data-g3-anim>
          <div className="g3-brand__mark">G3</div>
          <div>
            <div className="g3-brand__name">G3 Modena</div>
            <div className="g3-brand__sub">Backoffice</div>
          </div>
        </div>

        <div className="g3-search" data-g3-anim>
          <Search />
          <span>Cerca…</span>
          <kbd>⌘K</kbd>
        </div>

        <div className="g3-navgroup" data-g3-anim>
          <div className="g3-navgroup__label">Principale</div>
          <div className="g3-navitem is-active">
            <LayoutDashboard />
            <span>Dashboard</span>
          </div>
          <div className="g3-navitem">
            <MessageSquare />
            <span>Contatti</span>
            <span className="g3-navitem__badge">12</span>
          </div>
        </div>

        <div className="g3-navgroup" data-g3-anim>
          <div className="g3-navgroup__label">Marketing</div>
          <div className="g3-navitem">
            <Megaphone />
            <span>Campagne</span>
          </div>
        </div>

        <div className="g3-navgroup" data-g3-anim>
          <div className="g3-navgroup__label">CMS</div>
          <div className="g3-navitem">
            <FileEdit />
            <span>Web Editor</span>
          </div>
          <div className="g3-navitem">
            <Search />
            <span>SEO</span>
          </div>
        </div>

        <div className="g3-navgroup" data-g3-anim>
          <div className="g3-navgroup__label">Persone</div>
          <div className="g3-navitem">
            <Users />
            <span>Candidati</span>
          </div>
          <div className="g3-navitem">
            <UserRound />
            <span>Camerieri</span>
          </div>
        </div>

        <div className="g3-navgroup" data-g3-anim>
          <div className="g3-navgroup__label">Config</div>
          <div className="g3-navitem">
            <Building2 />
            <span>Sedi</span>
          </div>
          <div className="g3-navitem">
            <Settings />
            <span>Impostazioni</span>
          </div>
        </div>

        <div className="g3-sb__user" data-g3-anim>
          <div className="g3-avatar">AG</div>
          <div>
            <div className="g3-sb__user-name">Admin G3</div>
            <div className="g3-sb__user-mail">staff@g3modena.it</div>
          </div>
          <ChevronsUpDown />
        </div>
      </aside>

      {/* ---------------- Main ---------------- */}
      <div className="g3-main">
        <header className="g3-top" data-g3-anim>
          <div className="g3-crumb">
            <span className="g3-crumb__muted">Dashboard</span>
            <span className="g3-crumb__sep">›</span>
            <span className="g3-crumb__cur">Overview</span>
          </div>
          <div className="g3-top__spacer" />
          <div className="g3-top__btn">
            <Bell />
            <span className="g3-top__dot" />
          </div>
          <div className="g3-top__cta">
            <Plus />
            <span>Nuova campagna</span>
          </div>
        </header>

        <div className="g3-body">
          {/* ----- Stat cards ----- */}
          <div className="g3-stats" data-g3-anim>
            <div className="g3-card">
              <div className="g3-stat__head">
                <span>Messaggi nuovi</span>
                <MessageSquare />
              </div>
              <div className="g3-stat__val">12</div>
              <div className="g3-stat__foot">
                <span className="g3-trend up">
                  <TrendingUp />
                  +3
                </span>
                da leggere in inbox
              </div>
            </div>

            <div className="g3-card">
              <div className="g3-stat__head">
                <span>Candidature totali</span>
                <Users />
              </div>
              <div className="g3-stat__val">348</div>
              <div className="g3-stat__foot">
                <span className="g3-trend up">
                  <TrendingUp />
                  +18%
                </span>
                tutte le sedi
              </div>
            </div>

            <div className="g3-card">
              <div className="g3-stat__head">
                <span>Visite sito 30gg</span>
                <TrendingUp />
              </div>
              <div className="g3-stat__val">8.2k</div>
              <div className="g3-stat__foot">
                <span className="g3-trend up">
                  <TrendingUp />
                  +12%
                </span>
                vs mese scorso
              </div>
            </div>

            <div className="g3-card">
              <div className="g3-stat__head">
                <span>Tasso conversione</span>
                <TrendingDown />
              </div>
              <div className="g3-stat__val">4.1%</div>
              <div className="g3-stat__foot">
                <span className="g3-trend down">
                  <TrendingDown />
                  −0.4%
                </span>
                CTA → form inviato
              </div>
            </div>
          </div>

          {/* ----- Charts ----- */}
          <div className="g3-grid" data-g3-anim>
            {/* Traffico (area, span 2 righe a sinistra) */}
            <div className="g3-card g3-card--chart g3-span-col">
              <div className="g3-card__title">Traffico &amp; conversioni</div>
              <div className="g3-card__desc">Visite e click CTA · ultimi 6 mesi</div>
              <div className="g3-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRAFFIC} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="g3Visite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--c3)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--c3)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g3Cta" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--c2)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--c2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tickLine={false} axisLine={false} dy={6} />
                    <Area
                      type="monotone"
                      dataKey="visite"
                      stroke="var(--c3)"
                      strokeWidth={2.5}
                      fill="url(#g3Visite)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="cta"
                      stroke="var(--c2)"
                      strokeWidth={2.5}
                      fill="url(#g3Cta)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="g3-legend">
                <span className="g3-legend__i">
                  <span className="g3-legend__dot" style={{ background: "var(--c3)" }} />
                  Visite
                </span>
                <span className="g3-legend__i">
                  <span className="g3-legend__dot" style={{ background: "var(--c2)" }} />
                  Click CTA
                </span>
              </div>
            </div>

            {/* Sorgenti (donut, alto destra) */}
            <div className="g3-card g3-card--chart">
              <div className="g3-card__title">Sorgenti candidature</div>
              <div className="g3-card__chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SORGENTI}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="88%"
                      paddingAngle={2}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {SORGENTI.map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="g3-donut-center">
                  <b>348</b>
                  <span>candidature</span>
                </div>
              </div>
              <div className="g3-legend">
                {SORGENTI.map((s) => (
                  <span key={s.name} className="g3-legend__i">
                    <span className="g3-legend__dot" style={{ background: s.color }} />
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Ultimi messaggi (basso destra) */}
            <div className="g3-card g3-card--chart">
              <div className="g3-card__title">Ultimi messaggi</div>
              <div className="g3-list">
                {MESSAGGI.map((row) => (
                  <div className="g3-row" key={row.n}>
                    <span className="g3-row__av" style={{ background: row.c }}>
                      {initials(row.n)}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div className="g3-row__name">{row.n}</div>
                      <div className="g3-row__msg">{row.m}</div>
                    </div>
                    <span className={`g3-tag ${row.tag === "new" ? "g3-tag--new" : "g3-tag--open"}`}>
                      {row.tag === "new" ? "Nuovo" : "Aperto"}
                    </span>
                    <span className="g3-row__time">{row.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
