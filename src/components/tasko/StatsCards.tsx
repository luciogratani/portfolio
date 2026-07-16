"use client";

// Port di components/dashboard/stats-cards.tsx, colori rinominati ai token
// scoped `tasko-*`.
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/tasko/ui/card";
import { useState } from "react";

const stats = [
  {
    title: "Total Projects",
    value: "24",
    increase: "Increased from last month",
    bgColor: "bg-tasko-primary",
    textColor: "text-tasko-primary-foreground",
    delay: "0ms",
  },
  {
    title: "Ended Projects",
    value: "10",
    increase: "Increased from last month",
    bgColor: "bg-tasko-card",
    textColor: "text-tasko-foreground",
    delay: "100ms",
  },
  {
    title: "Running Projects",
    value: "12",
    increase: "Increased from last month",
    bgColor: "bg-tasko-card",
    textColor: "text-tasko-foreground",
    delay: "200ms",
  },
  {
    title: "Pending Project",
    value: "2",
    subtitle: "On Discuss",
    bgColor: "bg-tasko-card",
    textColor: "text-tasko-foreground",
    delay: "300ms",
  },
];

export function StatsCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ animationDelay: stat.delay }}
          className={`${stat.bgColor} ${stat.textColor} p-4 transition-all duration-500 ease-out animate-slide-in-up cursor-pointer ${
            hoveredCard === index ? "scale-105 shadow-2xl" : "shadow-lg"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xs font-medium opacity-90">{stat.title}</h3>
            <div
              className={`w-6 h-6 rounded-full ${
                stat.bgColor === "bg-tasko-primary" ? "bg-tasko-primary-foreground/20" : "bg-tasko-primary"
              } flex items-center justify-center transition-transform duration-300 ${
                hoveredCard === index ? "rotate-45" : ""
              }`}
            >
              <ArrowUpRight className="w-3 h-3 text-tasko-primary-foreground" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{stat.value}</p>
          <div className="flex items-center gap-1.5 text-xs opacity-80">
            {stat.increase && (
              <>
                <TrendingUp className="w-3 h-3" />
                <span>{stat.increase}</span>
              </>
            )}
            {stat.subtitle && <span>{stat.subtitle}</span>}
          </div>
        </Card>
      ))}
    </div>
  );
}
