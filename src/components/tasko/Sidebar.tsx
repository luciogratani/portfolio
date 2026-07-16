"use client";

// Port di components/dashboard/sidebar.tsx. Portiamo SOLO la dashboard home
// (vedi tasko/page.tsx): le altre voci del menu (Tasks/Calendar/Analytics/
// Team/Settings/Help/Logout) non hanno una route reale qui, quindi sono
// bottoni no-op invece di <Link href="/tasks"> ecc. (niente 404). "Dashboard"
// resta l'unica voce cliccabile/attiva, e torna alla home del portfolio
// tramite il logo (vedi in basso).
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Users, Settings, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/tasko/utils";
import { useState } from "react";
import Link from "next/link";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: CheckSquare, label: "Tasks", badge: "124" },
  { icon: Calendar, label: "Calendar" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Team" },
];

const generalItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
  { icon: LogOut, label: "Logout" },
];

export function Sidebar() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const itemClass = (label: string, active?: boolean) =>
    cn(
      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-300",
      active
        ? "bg-tasko-primary text-tasko-primary-foreground shadow-lg shadow-tasko-primary/20"
        : "text-tasko-muted-foreground hover:bg-tasko-secondary hover:text-tasko-foreground",
      hoveredItem === label && !active && "translate-x-1",
    );

  return (
    <aside className="fixed top-0 left-0 w-64 bg-tasko-card border-r border-tasko-border p-4 h-screen overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        {/* Il logo riporta all'home del portfolio (non a "/", che qui sarebbe
            fuori dalla route): stesso pattern di ritorno delle altre demo. */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-tasko-primary flex items-center justify-center transition-transform group-hover:scale-110 duration-300 relative">
            <div
              className="w-1.5 h-1.5 rounded-full bg-tasko-primary-foreground absolute"
              style={{ top: "30%", left: "30%" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-tasko-primary-foreground absolute"
              style={{ top: "30%", right: "30%" }}
            />
            <div className="w-3 h-1.5 border-b-2 border-tasko-primary-foreground rounded-full absolute bottom-2.5" />
          </div>
          <span className="text-lg font-semibold text-tasko-foreground">Tasko</span>
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-medium text-tasko-muted-foreground mb-2 uppercase tracking-wider">Menu</p>
          <nav className="space-y-0.5">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={!item.active}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(itemClass(item.label, item.active), !item.active && "cursor-default")}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-tasko-primary text-tasko-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-medium text-tasko-muted-foreground mb-2 uppercase tracking-wider">General</p>
          <nav className="space-y-0.5">
            {generalItems.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(itemClass(item.label), "cursor-default")}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
