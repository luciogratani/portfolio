"use client";

import { useMemo, useState } from "react";
import { Car, GraduationCap, Languages, MapPin } from "lucide-react";
import {
  CANDIDATES,
  CITIES,
  type Candidate,
  type PipelineStage,
  STAGE_LABEL,
  STAGE_ORDER,
  initials,
} from "@/components/g3/data";

export default function CandidatiPanel() {
  const [cards, setCards] = useState<Candidate[]>(CANDIDATES);
  const [city, setCity] = useState<string>("modena");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<PipelineStage | null>(null);

  const visible = useMemo(() => cards.filter((c) => c.city === city), [cards, city]);

  const drop = (stage: PipelineStage) => {
    if (!dragId) return;
    setCards((prev) => prev.map((c) => (c.id === dragId ? { ...c, stage } : c)));
    setDragId(null);
    setOverStage(null);
  };

  return (
    <div className="g3a-kanban-wrap">
      <div className="g3a-filters">
        <div className="g3a-tabs">
          {CITIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={`g3a-tab${city === c.slug ? " is-active" : ""}`}
              onClick={() => setCity(c.slug)}
            >
              {c.name}
              <span className="g3a-tab__count">
                {cards.filter((k) => k.city === c.slug).length}
              </span>
            </button>
          ))}
        </div>
        <p className="g3a-hint">Trascina le card tra le colonne per cambiare stato</p>
      </div>

      <div className="g3a-kanban">
        {STAGE_ORDER.map((stage) => {
          const list = visible.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              className={`g3a-col${overStage === stage ? " is-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage);
              }}
              onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
              onDrop={() => drop(stage)}
            >
              <div className="g3a-col__head">
                <span className={`g3a-col__dot g3a-stage-${stage}`} />
                <span className="g3a-col__title">{STAGE_LABEL[stage]}</span>
                <span className="g3a-col__count">{list.length}</span>
              </div>

              <div className="g3a-col__body">
                {list.map((c) => (
                  <article
                    key={c.id}
                    className={`g3a-kcard${dragId === c.id ? " is-dragging" : ""}`}
                    draggable
                    onDragStart={() => setDragId(c.id)}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverStage(null);
                    }}
                  >
                    <header className="g3a-kcard__head">
                      <span className="g3a-kcard__av" style={{ background: c.color }}>
                        {initials(c.fullName)}
                      </span>
                      <div className="g3a-kcard__id">
                        <div className="g3a-kcard__name">{c.fullName}</div>
                        <div className="g3a-kcard__age">{c.age} anni</div>
                      </div>
                    </header>
                    <ul className="g3a-kcard__meta">
                      <li><MapPin /> {c.residence}</li>
                      <li><GraduationCap /> {c.education}</li>
                      <li><Languages /> {c.languages.join(" · ")}</li>
                    </ul>
                    <footer className="g3a-kcard__tags">
                      <span className="g3a-chip">{c.availability}</span>
                      {c.driverLicense && (
                        <span className="g3a-chip g3a-chip--icon"><Car /> Patente</span>
                      )}
                      {c.experience && <span className="g3a-chip g3a-chip--ok">Esperienza</span>}
                    </footer>
                  </article>
                ))}
                {list.length === 0 && <div className="g3a-col__empty">Nessun candidato</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
