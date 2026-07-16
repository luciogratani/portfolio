"use client";

import { MousePointerClick, TrendingUp, Users } from "lucide-react";
import { CAMPAIGNS } from "@/components/g3/data";

const nf = new Intl.NumberFormat("it-IT");

function ctr(clicks: number, impressions: number) {
  return `${((clicks / impressions) * 100).toFixed(1)}%`;
}

export default function CampagnePanel() {
  const totImpr = CAMPAIGNS.reduce((s, c) => s + c.impressions, 0);
  const totClicks = CAMPAIGNS.reduce((s, c) => s + c.clicks, 0);
  const totCand = CAMPAIGNS.reduce((s, c) => s + c.candidates, 0);

  return (
    <div className="g3a-campagne">
      <div className="g3a-kpirow">
        <div className="g3a-card g3a-kpi">
          <div className="g3a-kpi__head"><TrendingUp /> Impression totali</div>
          <div className="g3a-kpi__val">{nf.format(totImpr)}</div>
        </div>
        <div className="g3a-card g3a-kpi">
          <div className="g3a-kpi__head"><MousePointerClick /> Click totali</div>
          <div className="g3a-kpi__val">{nf.format(totClicks)}</div>
        </div>
        <div className="g3a-card g3a-kpi">
          <div className="g3a-kpi__head"><Users /> Candidature generate</div>
          <div className="g3a-kpi__val">{nf.format(totCand)}</div>
        </div>
      </div>

      <div className="g3a-card g3a-tablecard">
        <div className="g3a-tablewrap">
          <table className="g3a-table">
            <thead>
              <tr>
                <th>Campagna</th>
                <th>UTM</th>
                <th>Inizio</th>
                <th className="g3a-num">Impression</th>
                <th className="g3a-num">Click</th>
                <th className="g3a-num">CTR</th>
                <th className="g3a-num">Candidature</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="g3a-cell-name">{c.name}</div>
                    <div className="g3a-cell-sub">{c.subtitle}</div>
                  </td>
                  <td>
                    <code className="g3a-utm">
                      {c.source}/{c.medium}
                      <span className="g3a-utm__cid">{c.cid}</span>
                    </code>
                  </td>
                  <td className="g3a-muted">{c.startsAt}</td>
                  <td className="g3a-num">{nf.format(c.impressions)}</td>
                  <td className="g3a-num">{nf.format(c.clicks)}</td>
                  <td className="g3a-num g3a-muted">{ctr(c.clicks, c.impressions)}</td>
                  <td className="g3a-num g3a-strong">{c.candidates}</td>
                  <td>
                    <span className={`g3a-pill g3a-pill--${c.status.replace(" ", "-")}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
