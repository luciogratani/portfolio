"use client";

import { useMemo, useState } from "react";
import { Archive, Mail, Phone, Reply } from "lucide-react";
import {
  CONTACT_MESSAGES,
  type ContactMessage,
  type ContactStatus,
  initials,
} from "@/components/g3/data";

const FILTERS: { key: ContactStatus | "tutti"; label: string }[] = [
  { key: "tutti", label: "Tutti" },
  { key: "nuovo", label: "Nuovi" },
  { key: "aperto", label: "Aperti" },
  { key: "chiuso", label: "Chiusi" },
];

const STATUS_LABEL: Record<ContactStatus, string> = {
  nuovo: "Nuovo",
  aperto: "Aperto",
  chiuso: "Chiuso",
};

export default function ContattiPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>(CONTACT_MESSAGES);
  const [filter, setFilter] = useState<ContactStatus | "tutti">("tutti");
  const [selectedId, setSelectedId] = useState<string>(CONTACT_MESSAGES[0].id);

  const list = useMemo(
    () => (filter === "tutti" ? messages : messages.filter((m) => m.status === filter)),
    [messages, filter],
  );
  const selected = messages.find((m) => m.id === selectedId) ?? list[0];

  const select = (m: ContactMessage) => {
    setSelectedId(m.id);
    // "Legge" il messaggio: nuovo → aperto (simulato, in-memory).
    if (m.status === "nuovo") {
      setMessages((prev) =>
        prev.map((x) => (x.id === m.id ? { ...x, status: "aperto" } : x)),
      );
    }
  };

  const setStatus = (id: string, status: ContactStatus) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

  return (
    <div className="g3a-inbox">
      {/* Lista */}
      <div className="g3a-inbox__list">
        <div className="g3a-inbox__filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`g3a-tab${filter === f.key ? " is-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              <span className="g3a-tab__count">
                {f.key === "tutti"
                  ? messages.length
                  : messages.filter((m) => m.status === f.key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="g3a-inbox__rows">
          {list.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`g3a-msgrow${selected?.id === m.id ? " is-active" : ""}`}
              onClick={() => select(m)}
            >
              <span className="g3a-msgrow__av" style={{ background: m.color }}>
                {initials(m.fullName)}
              </span>
              <span className="g3a-msgrow__body">
                <span className="g3a-msgrow__top">
                  <span className="g3a-msgrow__name">{m.fullName}</span>
                  <span className="g3a-msgrow__time">{m.time}</span>
                </span>
                <span className="g3a-msgrow__subj">{m.subject}</span>
                <span className="g3a-msgrow__prev">{m.message}</span>
              </span>
              {m.status === "nuovo" && <span className="g3a-msgrow__unread" />}
            </button>
          ))}
          {list.length === 0 && <div className="g3a-col__empty">Nessun messaggio</div>}
        </div>
      </div>

      {/* Dettaglio */}
      {selected && (
        <div className="g3a-inbox__detail">
          <div className="g3a-detail__head">
            <span className="g3a-detail__av" style={{ background: selected.color }}>
              {initials(selected.fullName)}
            </span>
            <div className="g3a-detail__id">
              <div className="g3a-detail__name">{selected.fullName}</div>
              <div className="g3a-detail__contacts">
                <span><Mail /> {selected.email}</span>
                <span><Phone /> {selected.phone}</span>
              </div>
            </div>
            <span className={`g3a-status g3a-status--${selected.status}`}>
              {STATUS_LABEL[selected.status]}
            </span>
          </div>

          <div className="g3a-detail__subject">{selected.subject}</div>
          <p className="g3a-detail__msg">{selected.message}</p>

          <div className="g3a-detail__actions">
            <button type="button" className="g3a-cta">
              <Reply /> Rispondi
            </button>
            <button
              type="button"
              className="g3a-btn"
              onClick={() => setStatus(selected.id, "chiuso")}
            >
              <Archive /> Archivia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
