// Stato condiviso (sessionStorage) per tornare all'ultima scheda dopo aver
// visitato un progetto, saltando hero + intro.
//
// Flusso:
// - UnderlayNav salva di continuo la sezione corrente (saveCurrentSection).
// - Un link-progetto, prima di navigare, marca "sto uscendo verso un progetto"
//   (markReturnFromProject).
// - Al rientro su "/", UnderlayNav legge una sola volta se è un ritorno
//   (peekReturn → indice della scheda, o null) e poi consuma il flag
//   (clearReturn). Presenza del flag = ritorno; assenza = accesso fresco/reload.
//
// Tutto in try/catch: in SSR (o storage negato) sessionStorage non esiste.

const SECTION_KEY = "portfolio:section";
const RETURN_KEY = "portfolio:return";

export function saveCurrentSection(section: number) {
  try {
    sessionStorage.setItem(SECTION_KEY, String(section));
  } catch {
    /* storage non disponibile: il ritorno semplicemente non avverrà */
  }
}

export function markReturnFromProject() {
  try {
    sessionStorage.setItem(RETURN_KEY, "1");
  } catch {
    /* storage non disponibile */
  }
}

// Legge SENZA consumare: sicuro in fase di render (idempotente). Ritorna
// l'indice della scheda a cui tornare, o null se non è un ritorno da progetto.
export function peekReturn(): number | null {
  try {
    if (sessionStorage.getItem(RETURN_KEY) !== "1") return null;
    const raw = sessionStorage.getItem(SECTION_KEY);
    const n = raw == null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

// Consuma il flag di ritorno (one-shot): da chiamare in un effect dopo il mount.
export function clearReturn() {
  try {
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    /* storage non disponibile */
  }
}
