"use client";

// Mini-dashboard Tasko leggera e "congelata" (mirror di BistroDemoSite/
// SfccDemoSite), pensata per vivere dentro il contenitore neutro di
// TaskoScreenCard (card 5): design fisso 1600×1000 (16:10, aspect
// provvisorio finche' non arriva il device mock — vedi TaskoScreenCard).
// NON e' la route reale /projects/tasko: solo sidebar + header + un
// sottoinsieme leggibile di widget (stats, chart statico, project list),
// niente scroll, ogni elemento cliccabile porta alla route reale.
//
// Semplificazione deliberata: qui il grafico "Weekly Activity" e' un bar
// chart CSS statico (niente recharts) — il widget vero con recharts vive
// nella route reale (components/tasko/ProjectAnalytics.tsx). Evita di
// duplicare peso/complessita' per un box congelato che non ha bisogno di
// interattivita' del grafico.
//
// Colori: valori hardcoded (non i token Tailwind `tasko-*` di tasko.css),
// stesso motivo di bistro-demo-site.css — quel CSS carica solo sotto
// /projects/tasko, mentre questo componente vive sulla home: le custom
// property non sarebbero definite li'.
//
// Vita del sito (gated su `active`, si resetta all'uscita cosi' si rigioca
// al rientro): entrance con stagger GSAP (fade + y) su sidebar/header/stats/
// chart/lista, come le altre DemoSite.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { taskoGeistSans } from "@/fonts/tasko-fonts";
import { markReturnFromProject } from "@/lib/return-nav";

const PROJECT_ROUTE = "/projects/tasko";

const NAV_ITEMS = [
  { label: "Dashboard", active: true },
  { label: "Tasks", badge: "124" },
  { label: "Calendar" },
  { label: "Analytics" },
  { label: "Team" },
];

const STATS = [
  { title: "Total Projects", value: "24", tone: "primary" as const },
  { title: "Ended Projects", value: "10", tone: "card" as const },
  { title: "Running Projects", value: "12", tone: "card" as const },
  { title: "Pending Project", value: "2", tone: "card" as const },
];

const CHART_BARS = [
  { day: "S", value: 45 },
  { day: "M", value: 75 },
  { day: "T", value: 74 },
  { day: "W", value: 92 },
  { day: "T", value: 35 },
  { day: "F", value: 60 },
  { day: "S", value: 50 },
];

const PROJECTS = [
  { name: "Develop API Endpoints", date: "Nov 26, 2024", icon: "⚡" },
  { name: "Onboarding Flow", date: "Nov 28, 2024", icon: "🌊" },
  { name: "Build Dashboard", date: "Nov 30, 2024", icon: "🎨" },
];

export default function TaskoDemoSite({ active }: { active: boolean }) {
  const router = useRouter();
  const openProject = () => {
    markReturnFromProject();
    router.push(PROJECT_ROUTE);
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Entrance granulare (stesso pattern di BistroDemoSite/SfccDemoSite): i
  // blocchi principali entrano in stagger, non l'intero box in un colpo solo.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = (
      [sidebarRef.current, headerRef.current, statsRef.current, chartRef.current, listRef.current] as (
        | HTMLElement
        | null
      )[]
    ).filter((el): el is HTMLElement => el !== null);

    const ctx = gsap.context(() => {
      if (!active) {
        gsap.set(targets, { opacity: 0, y: 28 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 28 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        delay: 0.1,
      });
    }, root);

    return () => ctx.revert();
  }, [active]);

  const maxValue = Math.max(...CHART_BARS.map((b) => b.value));

  return (
    <div
      ref={rootRef}
      className={`tasko-demo-site ${taskoGeistSans.variable}`}
      onClick={openProject}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {/* Sidebar */}
      <div ref={sidebarRef} className="tasko-demo-site__sidebar">
        <Link
          href={PROJECT_ROUTE}
          onClick={markReturnFromProject}
          className="tasko-demo-site__logo"
        >
          <span className="tasko-demo-site__logo-dot" />
          Tasko
        </Link>

        <p className="tasko-demo-site__nav-label">Menu</p>
        <nav className="tasko-demo-site__nav">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              className={`tasko-demo-site__nav-link ${item.active ? "is-active" : ""}`}
            >
              {item.label}
              {item.badge && <span className="tasko-demo-site__nav-badge">{item.badge}</span>}
            </span>
          ))}
        </nav>
      </div>

      {/* Main */}
      <div className="tasko-demo-site__main">
        <div ref={headerRef} className="tasko-demo-site__header">
          <div className="tasko-demo-site__search">Search task</div>
          <div className="tasko-demo-site__profile">
            <span className="tasko-demo-site__avatar">JS</span>
            <span className="tasko-demo-site__profile-name">Jessin Sam</span>
          </div>
        </div>

        <h1 className="tasko-demo-site__title">Dashboard</h1>
        <p className="tasko-demo-site__subtitle">Plan, prioritize, and accomplish your tasks with ease.</p>

        <div ref={statsRef} className="tasko-demo-site__stats">
          {STATS.map((stat) => (
            <div key={stat.title} className={`tasko-demo-site__stat tasko-demo-site__stat--${stat.tone}`}>
              <span className="tasko-demo-site__stat-title">{stat.title}</span>
              <span className="tasko-demo-site__stat-value">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="tasko-demo-site__row">
          <div ref={chartRef} className="tasko-demo-site__chart-card">
            <div className="tasko-demo-site__chart-head">
              <span>Project Analytics</span>
              <span className="tasko-demo-site__chart-tag">Weekly Activity</span>
            </div>
            <div className="tasko-demo-site__chart">
              {CHART_BARS.map((bar, i) => (
                <div key={`${bar.day}-${i}`} className="tasko-demo-site__bar-col">
                  <div
                    className="tasko-demo-site__bar"
                    style={{ height: `${(bar.value / maxValue) * 100}%` }}
                  />
                  <span className="tasko-demo-site__bar-label">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div ref={listRef} className="tasko-demo-site__list-card">
            <div className="tasko-demo-site__chart-head">
              <span>Project</span>
            </div>
            <div className="tasko-demo-site__list">
              {PROJECTS.map((project) => (
                <div key={project.name} className="tasko-demo-site__list-item">
                  <span className="tasko-demo-site__list-icon">{project.icon}</span>
                  <div className="tasko-demo-site__list-text">
                    <span className="tasko-demo-site__list-name">{project.name}</span>
                    <span className="tasko-demo-site__list-date">Due date: {project.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
