"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Building2,
  ChevronsUpDown,
  FileEdit,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  UserRound,
  Users,
} from "lucide-react";
import { ADMIN, DASHBOARD_STATS } from "@/components/g3/data";
import DashboardPanel from "./panels/DashboardPanel";
import CandidatiPanel from "./panels/CandidatiPanel";
import ContattiPanel from "./panels/ContattiPanel";
import CampagnePanel from "./panels/CampagnePanel";
import CamerieriPanel from "./panels/CamerieriPanel";

export type SectionKey =
  | "dashboard"
  | "candidati"
  | "contatti"
  | "campagne"
  | "camerieri";

type NavItem = {
  key: SectionKey | string;
  label: string;
  icon: LucideIcon;
  enabled: boolean;
  badge?: string;
};
type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    label: "Principale",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, enabled: true },
      {
        key: "contatti",
        label: "Contatti",
        icon: MessageSquare,
        enabled: true,
        badge: String(DASHBOARD_STATS.newMessages),
      },
    ],
  },
  {
    label: "Marketing",
    items: [{ key: "campagne", label: "Campagne", icon: Megaphone, enabled: true }],
  },
  {
    label: "Persone",
    items: [
      { key: "candidati", label: "Candidati", icon: Users, enabled: true },
      { key: "camerieri", label: "Camerieri", icon: UserRound, enabled: true },
    ],
  },
  {
    label: "CMS",
    items: [
      { key: "cms", label: "Web Editor", icon: FileEdit, enabled: false },
      { key: "seo", label: "SEO", icon: Search, enabled: false },
    ],
  },
  {
    label: "Config",
    items: [
      { key: "sedi", label: "Sedi", icon: Building2, enabled: false },
      { key: "impostazioni", label: "Impostazioni", icon: Settings, enabled: false },
    ],
  },
];

const CRUMB: Record<SectionKey, [string, string]> = {
  dashboard: ["Dashboard", "Overview"],
  contatti: ["Contatti", "Messaggi"],
  campagne: ["Marketing", "Campagne"],
  candidati: ["Persone", "Candidati"],
  camerieri: ["Persone", "Camerieri"],
};

const CTA: Record<SectionKey, string | null> = {
  dashboard: "Nuova campagna",
  contatti: null,
  campagne: "Nuova campagna",
  candidati: "Aggiungi candidato",
  camerieri: "Aggiungi cameriere",
};

export default function G3App() {
  const router = useRouter();
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [crumbTop, crumbCur] = CRUMB[section];
  const cta = CTA[section];

  return (
    <div className="g3-app" data-theme={theme}>
      {/* -------------------- Sidebar -------------------- */}
      <aside className="g3a-sb">
        <button
          type="button"
          className="g3a-back"
          onClick={() => router.back()}
          aria-label="Torna al portfolio"
        >
          <ArrowLeft />
          <span>Portfolio</span>
        </button>

        <div className="g3a-brand">
          <div className="g3a-brand__mark">G3</div>
          <div>
            <div className="g3a-brand__name">G3 Modena</div>
            <div className="g3a-brand__sub">Backoffice</div>
          </div>
        </div>

        <div className="g3a-search">
          <Search />
          <span>Cerca…</span>
          <kbd>⌘K</kbd>
        </div>

        <nav className="g3a-nav">
          {NAV.map((group) => (
            <div className="g3a-navgroup" key={group.label}>
              <div className="g3a-navgroup__label">{group.label}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.enabled && item.key === section;
                return (
                  <button
                    type="button"
                    key={item.key}
                    className={`g3a-navitem${active ? " is-active" : ""}${
                      item.enabled ? "" : " is-disabled"
                    }`}
                    disabled={!item.enabled}
                    title={item.enabled ? undefined : "Non disponibile nella demo"}
                    onClick={() => item.enabled && setSection(item.key as SectionKey)}
                  >
                    <Icon />
                    <span>{item.label}</span>
                    {item.badge && <span className="g3a-navitem__badge">{item.badge}</span>}
                    {!item.enabled && <span className="g3a-navitem__soon">demo</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="g3a-sb__user">
          <div className="g3a-avatar">{ADMIN.initials}</div>
          <div className="g3a-sb__user-txt">
            <div className="g3a-sb__user-name">{ADMIN.name}</div>
            <div className="g3a-sb__user-mail">{ADMIN.email}</div>
          </div>
          <ChevronsUpDown />
        </div>
      </aside>

      {/* -------------------- Main -------------------- */}
      <div className="g3a-main">
        <header className="g3a-top">
          <div className="g3a-crumb">
            <span className="g3a-crumb__muted">{crumbTop}</span>
            <span className="g3a-crumb__sep">›</span>
            <span className="g3a-crumb__cur">{crumbCur}</span>
          </div>
          <div className="g3a-top__spacer" />
          <button
            type="button"
            className="g3a-iconbtn"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label="Cambia tema"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>
          <button type="button" className="g3a-iconbtn" aria-label="Notifiche">
            <Bell />
            <span className="g3a-iconbtn__dot" />
          </button>
          {cta && (
            <button type="button" className="g3a-cta">
              <Plus />
              <span>{cta}</span>
            </button>
          )}
        </header>

        <div className="g3a-body">
          {section === "dashboard" && <DashboardPanel />}
          {section === "candidati" && <CandidatiPanel />}
          {section === "contatti" && <ContattiPanel />}
          {section === "campagne" && <CampagnePanel />}
          {section === "camerieri" && <CamerieriPanel />}
        </div>
      </div>
    </div>
  );
}
