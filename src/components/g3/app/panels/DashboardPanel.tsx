"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { MessageSquare, TrendingDown, TrendingUp, Users } from "lucide-react";
import {
  CANDIDATES_PER_MONTH,
  CHART,
  CITY_PIPELINE,
  DASHBOARD_STATS,
  SOURCE_DISTRIBUTION,
  TRAFFIC_PER_MONTH,
} from "@/components/g3/data";

const SOURCE_COLORS = [CHART.c1, CHART.c2, CHART.c3, CHART.c4];

function Stat({
  title,
  value,
  trend,
  up,
  desc,
  icon: Icon,
}: {
  title: string;
  value: string;
  trend: string;
  up: boolean;
  desc: string;
  icon: typeof Users;
}) {
  return (
    <div className="g3a-card g3a-stat">
      <div className="g3a-stat__head">
        <span>{title}</span>
        <Icon />
      </div>
      <div className="g3a-stat__val">{value}</div>
      <div className="g3a-stat__foot">
        <span className={`g3a-trend ${up ? "up" : "down"}`}>
          {up ? <TrendingUp /> : <TrendingDown />}
          {trend}
        </span>
        {desc}
      </div>
    </div>
  );
}

export default function DashboardPanel() {
  return (
    <div className="g3a-dash">
      <div className="g3a-stats">
        <Stat title="Messaggi nuovi" value={String(DASHBOARD_STATS.newMessages)} trend="+3" up desc="da leggere in inbox" icon={MessageSquare} />
        <Stat title="Candidature totali" value={String(DASHBOARD_STATS.candidatesTotal)} trend="+18%" up desc="tutte le sedi" icon={Users} />
        <Stat title="Eventi ingest 30gg" value={DASHBOARD_STATS.ingestEvents30d} trend="+12%" up desc="analytics ricevuti" icon={TrendingUp} />
        <Stat title="Tasso conversione" value={DASHBOARD_STATS.conversion} trend="−0.4%" up={false} desc="CTA → form inviato" icon={TrendingDown} />
      </div>

      <div className="g3a-dashgrid">
        {/* Traffico (area) */}
        <div className="g3a-card g3a-chartcard g3a-col-2">
          <div className="g3a-card__title">Traffico &amp; conversioni</div>
          <div className="g3a-card__desc">Visite, click CTA e form · ultimi 6 mesi</div>
          <div className="g3a-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_PER_MONTH} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="g3aVisite" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.c3} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART.c3} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3aCta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.c2} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={CHART.c2} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} dy={6} />
                <Area type="monotone" dataKey="visite" stroke={CHART.c3} strokeWidth={2.5} fill="url(#g3aVisite)" isAnimationActive={false} />
                <Area type="monotone" dataKey="cta" stroke={CHART.c2} strokeWidth={2.5} fill="url(#g3aCta)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="g3a-legend">
            <span className="g3a-legend__i"><span className="g3a-legend__dot" style={{ background: CHART.c3 }} />Visite</span>
            <span className="g3a-legend__i"><span className="g3a-legend__dot" style={{ background: CHART.c2 }} />Click CTA</span>
          </div>
        </div>

        {/* Sorgenti (donut) */}
        <div className="g3a-card g3a-chartcard">
          <div className="g3a-card__title">Sorgenti candidature</div>
          <div className="g3a-chart g3a-chart--donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SOURCE_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2} stroke="none" isAnimationActive={false}>
                  {SOURCE_DISTRIBUTION.map((s, i) => (
                    <Cell key={s.name} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="g3a-donut-center">
              <b>{DASHBOARD_STATS.candidatesTotal}</b>
              <span>candidature</span>
            </div>
          </div>
          <div className="g3a-legend">
            {SOURCE_DISTRIBUTION.map((s, i) => (
              <span key={s.name} className="g3a-legend__i">
                <span className="g3a-legend__dot" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Candidature per mese (bar) */}
        <div className="g3a-card g3a-chartcard">
          <div className="g3a-card__title">Candidature per mese</div>
          <div className="g3a-card__desc">Volume ricevuto · ultimi 6 mesi</div>
          <div className="g3a-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CANDIDATES_PER_MONTH} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" tickLine={false} axisLine={false} dy={6} />
                <Bar dataKey="candidates" fill={CHART.c2} radius={[5, 5, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline per città (stacked bar) */}
        <div className="g3a-card g3a-chartcard g3a-col-2">
          <div className="g3a-card__title">Pipeline candidature per città</div>
          <div className="g3a-card__desc">Distribuzione per stato e sede</div>
          <div className="g3a-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_PIPELINE} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="city" tickLine={false} axisLine={false} dy={6} />
                <Bar dataKey="nuovo" stackId="a" fill={CHART.c1} isAnimationActive={false} />
                <Bar dataKey="colloquio" stackId="a" fill={CHART.c2} isAnimationActive={false} />
                <Bar dataKey="formazione" stackId="a" fill={CHART.c3} isAnimationActive={false} />
                <Bar dataKey="altro" stackId="a" fill={CHART.c4} radius={[5, 5, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="g3a-legend">
            <span className="g3a-legend__i"><span className="g3a-legend__dot" style={{ background: CHART.c1 }} />Nuovo</span>
            <span className="g3a-legend__i"><span className="g3a-legend__dot" style={{ background: CHART.c2 }} />Colloquio</span>
            <span className="g3a-legend__i"><span className="g3a-legend__dot" style={{ background: CHART.c3 }} />Formazione</span>
            <span className="g3a-legend__i"><span className="g3a-legend__dot" style={{ background: CHART.c4 }} />Altro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
