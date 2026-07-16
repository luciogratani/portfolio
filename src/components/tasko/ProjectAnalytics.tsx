"use client";

// Port di components/dashboard/project-analytics.tsx: unico widget con
// recharts. Colori di sfondo/testo sui token scoped `tasko-*`, i colori
// delle barre restano gli esadecimali fissi dell'originale (non dipendono
// dal tema).
import { Card } from "@/components/tasko/ui/card";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const chartData = [
  { day: "S", value: 45, label: "Sunday" },
  { day: "M", value: 75, label: "Monday" },
  { day: "T", value: 74, label: "Tuesday" },
  { day: "W", value: 92, label: "Wednesday" },
  { day: "T", value: 35, label: "Thursday" },
  { day: "F", value: 60, label: "Friday" },
  { day: "S", value: 50, label: "Saturday" },
];

const barColors = ["#059669", "#047857", "#10b981", "#065f46", "#059669", "#047857", "#10b981"];

interface TooltipPayloadItem {
  value: number;
  payload: { label: string };
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tasko-foreground text-tasko-background px-3 py-2 rounded-lg text-xs font-semibold shadow-lg">
        <p className="font-bold">{payload[0].value}%</p>
        <p className="text-[10px] opacity-80">{payload[0].payload.label}</p>
      </div>
    );
  }
  return null;
}

export function ProjectAnalytics() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxValue = Math.max(...chartData.map((d) => d.value));
  const average = Math.round(chartData.reduce((acc, d) => acc + d.value, 0) / chartData.length);

  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up bg-gradient-to-br from-tasko-background to-tasko-muted/20"
      style={{ animationDelay: "400ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-tasko-foreground">Project Analytics</h2>
        <div className="flex items-center gap-2 text-xs text-tasko-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Weekly Activity</span>
        </div>
      </div>

      <div className="h-64 mb-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tasko-bar-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-tasko-muted/20" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 14 }}
              className="text-tasko-muted-foreground"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "currentColor", fontSize: 12 }}
              className="text-tasko-muted-foreground"
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="value"
              fill="url(#tasko-bar-gradient)"
              radius={[12, 12, 12, 12]}
              maxBarSize={60}
              onMouseEnter={(_data, index) => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={barColors[index]}
                  className="transition-all duration-300"
                  style={{
                    filter:
                      hoveredBar === index ? "brightness(1.2) drop-shadow(0 4px 8px rgba(5, 150, 105, 0.4))" : "none",
                    transformOrigin: "center bottom",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-4 border-t border-tasko-muted/50 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-tasko-muted-foreground">Average: </span>
          <span className="font-semibold text-tasko-foreground">{average}%</span>
        </div>
        <div className="text-sm">
          <span className="text-tasko-muted-foreground">Peak: </span>
          <span className="font-semibold text-emerald-600">{maxValue}%</span>
        </div>
      </div>
    </Card>
  );
}
