"use client";

import { useMemo, useState } from "react";
import { Mail, Phone } from "lucide-react";
import { CITIES, STAFF, initials } from "@/components/g3/data";

export default function CamerieriPanel() {
  const [city, setCity] = useState<string>("modena");
  const visible = useMemo(() => STAFF.filter((s) => s.city === city), [city]);

  return (
    <div className="g3a-roster-wrap">
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
                {STAFF.filter((s) => s.city === c.slug).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="g3a-roster">
        {visible.map((s) => (
          <article key={s.id} className="g3a-card g3a-staff">
            <header className="g3a-staff__head">
              <span className="g3a-staff__av" style={{ background: s.color }}>
                {initials(s.fullName)}
              </span>
              <div className="g3a-staff__id">
                <div className="g3a-staff__name">{s.fullName}</div>
                <div className="g3a-staff__role">{s.role}</div>
              </div>
              <span className={`g3a-dot ${s.active ? "g3a-dot--on" : "g3a-dot--off"}`} title={s.active ? "Attivo" : "Non attivo"} />
            </header>

            <ul className="g3a-staff__contacts">
              <li><Mail /> {s.email}</li>
              <li><Phone /> {s.phone}</li>
            </ul>

            <footer className="g3a-staff__tags">
              {s.tags.map((t) => (
                <span key={t} className="g3a-chip">{t}</span>
              ))}
              <span className={`g3a-chip ${s.active ? "g3a-chip--ok" : "g3a-chip--muted"}`}>
                {s.active ? "Disponibile" : "Non attivo"}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
