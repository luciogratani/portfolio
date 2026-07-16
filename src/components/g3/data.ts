// Dati mock del gestionale G3 Modena — TUTTI hardcoded (nessun fetch, nessun
// Supabase). Ricalcano le forme dei repository dell'admin reale (StaffRow,
// CandidateRow, ContactMessage, CampaignDbRow, DashboardData) ma in versione
// "congelata" per la demo /projects/g3. Dominio: staffing/hospitality modenese.

// ---------------------------------------------------------------- Sedi
export type City = { slug: string; name: string };
export const CITIES: City[] = [
  { slug: "modena", name: "Modena" },
  { slug: "bologna", name: "Bologna" },
  { slug: "reggio", name: "Reggio Emilia" },
];

// ---------------------------------------------------------------- Profilo
export const ADMIN = {
  name: "Admin G3",
  email: "staff@g3modena.it",
  initials: "AG",
};

// ---------------------------------------------------------------- Dashboard
export const DASHBOARD_STATS = {
  newMessages: 12,
  candidatesTotal: 348,
  ingestEvents30d: "24.5k",
  conversion: "4.1%",
};

export const CANDIDATES_PER_MONTH = [
  { month: "Feb", candidates: 38 },
  { month: "Mar", candidates: 52 },
  { month: "Apr", candidates: 47 },
  { month: "Mag", candidates: 61 },
  { month: "Giu", candidates: 74 },
  { month: "Lug", candidates: 76 },
];

export const TRAFFIC_PER_MONTH = [
  { month: "Feb", visite: 4200, cta: 620, form: 210 },
  { month: "Mar", visite: 5100, cta: 780, form: 260 },
  { month: "Apr", visite: 4800, cta: 710, form: 240 },
  { month: "Mag", visite: 6400, cta: 1020, form: 320 },
  { month: "Giu", visite: 7300, cta: 1180, form: 360 },
  { month: "Lug", visite: 8200, cta: 1340, form: 410 },
];

export const SOURCE_DISTRIBUTION = [
  { name: "Instagram", value: 38 },
  { name: "Diretto", value: 26 },
  { name: "Google", value: 21 },
  { name: "Referral", value: 15 },
];

export const CITY_PIPELINE = [
  { city: "Modena", nuovo: 22, colloquio: 14, formazione: 9, altro: 6 },
  { city: "Bologna", nuovo: 18, colloquio: 11, formazione: 7, altro: 4 },
  { city: "Reggio", nuovo: 12, colloquio: 6, formazione: 4, altro: 3 },
];

// Palette chart (hsl default shadcn). Usata sia in dashboard che altrove.
export const CHART = {
  c1: "hsl(12 76% 61%)",
  c2: "hsl(173 58% 39%)",
  c3: "hsl(197 37% 34%)",
  c4: "hsl(43 74% 66%)",
  c5: "hsl(27 87% 67%)",
};

// ---------------------------------------------------------------- Candidati (kanban)
export type PipelineStage = "nuovo" | "colloquio" | "formazione" | "assunto";
export const STAGE_LABEL: Record<PipelineStage, string> = {
  nuovo: "Nuovo",
  colloquio: "Colloquio",
  formazione: "Formazione",
  assunto: "Assunto",
};
export const STAGE_ORDER: PipelineStage[] = ["nuovo", "colloquio", "formazione", "assunto"];

export type Candidate = {
  id: string;
  fullName: string;
  age: number;
  city: string; // slug sede
  residence: string;
  availability: string;
  education: string;
  languages: string[];
  driverLicense: boolean;
  experience: boolean;
  stage: PipelineStage;
  color: string; // avatar
};

const C = CHART;
export const CANDIDATES: Candidate[] = [
  { id: "c1", fullName: "Giulia Ferrari", age: 22, city: "modena", residence: "Modena", availability: "Serale + weekend", education: "Diploma alberghiero", languages: ["IT", "EN"], driverLicense: true, experience: true, stage: "nuovo", color: C.c1 },
  { id: "c2", fullName: "Marco Bianchi", age: 25, city: "modena", residence: "Carpi", availability: "Full time", education: "Laurea triennale", languages: ["IT", "EN", "ES"], driverLicense: true, experience: true, stage: "nuovo", color: C.c3 },
  { id: "c3", fullName: "Sara Conti", age: 20, city: "modena", residence: "Modena", availability: "Part time", education: "Studentessa", languages: ["IT", "EN"], driverLicense: false, experience: false, stage: "nuovo", color: C.c2 },
  { id: "c4", fullName: "Luca Romano", age: 28, city: "modena", residence: "Formigine", availability: "Weekend", education: "Diploma", languages: ["IT"], driverLicense: true, experience: true, stage: "nuovo", color: C.c5 },
  { id: "c5", fullName: "Elisa Neri", age: 23, city: "modena", residence: "Sassuolo", availability: "Serale", education: "Laurea magistrale", languages: ["IT", "EN", "FR"], driverLicense: true, experience: false, stage: "colloquio", color: C.c4 },
  { id: "c6", fullName: "Davide Gallo", age: 26, city: "modena", residence: "Modena", availability: "Full time", education: "Diploma tecnico", languages: ["IT", "EN"], driverLicense: true, experience: true, stage: "colloquio", color: C.c1 },
  { id: "c7", fullName: "Chiara Costa", age: 21, city: "modena", residence: "Maranello", availability: "Part time", education: "Studentessa", languages: ["IT", "DE"], driverLicense: false, experience: false, stage: "colloquio", color: C.c2 },
  { id: "c8", fullName: "Matteo Ricci", age: 24, city: "modena", residence: "Modena", availability: "Serale + weekend", education: "Diploma alberghiero", languages: ["IT", "EN"], driverLicense: true, experience: true, stage: "formazione", color: C.c3 },
  { id: "c9", fullName: "Alice Moretti", age: 27, city: "modena", residence: "Castelfranco", availability: "Full time", education: "Laurea triennale", languages: ["IT", "EN", "ES"], driverLicense: true, experience: true, stage: "formazione", color: C.c5 },
  { id: "c10", fullName: "Federico Villa", age: 29, city: "modena", residence: "Modena", availability: "Full time", education: "Diploma", languages: ["IT", "EN"], driverLicense: true, experience: true, stage: "assunto", color: C.c4 },
  { id: "c11", fullName: "Martina Greco", age: 22, city: "modena", residence: "Nonantola", availability: "Weekend", education: "Studentessa", languages: ["IT", "EN"], driverLicense: false, experience: false, stage: "assunto", color: C.c2 },
  // Bologna
  { id: "c12", fullName: "Simone Rizzo", age: 24, city: "bologna", residence: "Bologna", availability: "Serale", education: "Diploma alberghiero", languages: ["IT", "EN"], driverLicense: true, experience: true, stage: "nuovo", color: C.c1 },
  { id: "c13", fullName: "Anna Fontana", age: 21, city: "bologna", residence: "Casalecchio", availability: "Part time", education: "Studentessa", languages: ["IT", "FR"], driverLicense: false, experience: false, stage: "nuovo", color: C.c3 },
  { id: "c14", fullName: "Paolo De Luca", age: 30, city: "bologna", residence: "Bologna", availability: "Full time", education: "Laurea magistrale", languages: ["IT", "EN", "DE"], driverLicense: true, experience: true, stage: "colloquio", color: C.c5 },
  { id: "c15", fullName: "Valentina Serra", age: 23, city: "bologna", residence: "San Lazzaro", availability: "Weekend", education: "Diploma", languages: ["IT", "EN"], driverLicense: true, experience: false, stage: "formazione", color: C.c2 },
  // Reggio
  { id: "c16", fullName: "Andrea Lombardi", age: 26, city: "reggio", residence: "Reggio Emilia", availability: "Full time", education: "Diploma tecnico", languages: ["IT", "EN"], driverLicense: true, experience: true, stage: "nuovo", color: C.c4 },
  { id: "c17", fullName: "Beatrice Marini", age: 20, city: "reggio", residence: "Correggio", availability: "Serale + weekend", education: "Studentessa", languages: ["IT", "EN"], driverLicense: false, experience: false, stage: "colloquio", color: C.c1 },
];

// ---------------------------------------------------------------- Camerieri (staff)
export type Staff = {
  id: string;
  fullName: string;
  city: string;
  email: string;
  phone: string;
  role: string;
  tags: string[];
  active: boolean;
  color: string;
};

export const STAFF: Staff[] = [
  { id: "s1", fullName: "Federico Villa", city: "modena", email: "f.villa@g3modena.it", phone: "+39 340 118 22 03", role: "Cameriere di sala", tags: ["Banqueting", "Vino"], active: true, color: C.c4 },
  { id: "s2", fullName: "Martina Greco", city: "modena", email: "m.greco@g3modena.it", phone: "+39 342 771 09 55", role: "Banconista", tags: ["Caffetteria"], active: true, color: C.c2 },
  { id: "s3", fullName: "Giovanni Esposito", city: "modena", email: "g.esposito@g3modena.it", phone: "+39 333 902 44 18", role: "Chef de rang", tags: ["Fine dining", "Sommelier"], active: true, color: C.c3 },
  { id: "s4", fullName: "Laura Barbieri", city: "modena", email: "l.barbieri@g3modena.it", phone: "+39 348 220 71 66", role: "Hostess", tags: ["Eventi"], active: false, color: C.c1 },
  { id: "s5", fullName: "Riccardo Fabbri", city: "modena", email: "r.fabbri@g3modena.it", phone: "+39 347 665 30 21", role: "Barman", tags: ["Cocktail", "Eventi"], active: true, color: C.c5 },
  { id: "s6", fullName: "Silvia Colombo", city: "bologna", email: "s.colombo@g3modena.it", phone: "+39 349 112 88 40", role: "Cameriera di sala", tags: ["Banqueting"], active: true, color: C.c2 },
  { id: "s7", fullName: "Antonio Ferri", city: "bologna", email: "a.ferri@g3modena.it", phone: "+39 331 448 19 72", role: "Runner", tags: ["Catering"], active: true, color: C.c3 },
  { id: "s8", fullName: "Elena Santoro", city: "bologna", email: "e.santoro@g3modena.it", phone: "+39 346 720 55 09", role: "Chef de rang", tags: ["Fine dining"], active: false, color: C.c4 },
  { id: "s9", fullName: "Marco Bruno", city: "reggio", email: "m.bruno@g3modena.it", phone: "+39 340 559 62 14", role: "Cameriere di sala", tags: ["Eventi"], active: true, color: C.c1 },
  { id: "s10", fullName: "Giada Rinaldi", city: "reggio", email: "g.rinaldi@g3modena.it", phone: "+39 342 083 47 91", role: "Banconista", tags: ["Caffetteria", "Aperitivi"], active: true, color: C.c5 },
];

// ---------------------------------------------------------------- Messaggi contatti
export type ContactStatus = "nuovo" | "aperto" | "chiuso";
export type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  time: string;
  color: string;
};

export const CONTACT_MESSAGES: ContactMessage[] = [
  { id: "m1", fullName: "Giulia Ferrari", email: "giulia.ferrari@gmail.com", phone: "+39 340 118 22 03", subject: "Disponibilità turno serale", message: "Buongiorno, sarei disponibile per i turni serali del weekend. Ho esperienza come cameriera di sala in banqueting. Resto a disposizione per un colloquio.", status: "nuovo", time: "8 min fa", color: C.c1 },
  { id: "m2", fullName: "Marco Bianchi", email: "m.bianchi88@outlook.it", phone: "+39 342 771 09 55", subject: "Candidatura cameriere — sede Modena", message: "Salve, invio la mia candidatura per la posizione di cameriere sulla sede di Modena. Allego CV. Disponibilità full time da settembre.", status: "nuovo", time: "34 min fa", color: C.c3 },
  { id: "m3", fullName: "Sara Conti", email: "sara.conti@gmail.com", phone: "+39 333 902 44 18", subject: "Preventivo catering evento", message: "Vorrei un preventivo per un servizio di catering per circa 80 persone, evento aziendale a fine mese a Modena centro.", status: "aperto", time: "1 h fa", color: C.c2 },
  { id: "m4", fullName: "Luca Romano", email: "luca.romano@libero.it", phone: "+39 348 220 71 66", subject: "Info posizione banconista", message: "Buonasera, ho visto l'annuncio per banconista. Vorrei sapere se la posizione è ancora aperta e quali sono gli orari.", status: "aperto", time: "3 h fa", color: C.c5 },
  { id: "m5", fullName: "Elisa Neri", email: "elisa.neri@gmail.com", phone: "+39 347 665 30 21", subject: "Collaborazione eventi", message: "Organizzo eventi privati e cerco un partner affidabile per il servizio di sala. Possiamo sentirci per una collaborazione continuativa?", status: "aperto", time: "5 h fa", color: C.c4 },
  { id: "m6", fullName: "Davide Gallo", email: "d.gallo@gmail.com", phone: "+39 349 112 88 40", subject: "Ricontatto colloquio", message: "Grazie per la disponibilità di ieri. Confermo il mio interesse per la posizione, resto in attesa di vostre.", status: "chiuso", time: "1 g fa", color: C.c1 },
  { id: "m7", fullName: "Chiara Costa", email: "chiara.costa@gmail.com", phone: "+39 331 448 19 72", subject: "Part time studentessa", message: "Sono una studentessa universitaria, cerco un part time nei weekend. Disponibile da subito.", status: "chiuso", time: "2 g fa", color: C.c2 },
  { id: "m8", fullName: "Matteo Ricci", email: "matteo.ricci@gmail.com", phone: "+39 346 720 55 09", subject: "Aggiornamento disponibilità", message: "Aggiorno la mia disponibilità: da questo mese posso coprire anche i turni infrasettimanali a pranzo.", status: "chiuso", time: "3 g fa", color: C.c3 },
];

// ---------------------------------------------------------------- Campagne
export type Campaign = {
  id: string;
  name: string;
  subtitle: string;
  cid: string;
  source: string;
  medium: string;
  campaign: string;
  startsAt: string;
  impressions: number;
  clicks: number;
  candidates: number;
  status: "attiva" | "in pausa" | "conclusa";
};

export const CAMPAIGNS: Campaign[] = [
  { id: "cmp1", name: "Recruiting Estate", subtitle: "Camerieri stagionali Riviera", cid: "g3-est-25", source: "instagram", medium: "social", campaign: "recruiting_estate_25", startsAt: "01 Giu 2025", impressions: 48200, clicks: 1340, candidates: 76, status: "attiva" },
  { id: "cmp2", name: "Lavora con Noi", subtitle: "Sempre attiva — brand", cid: "g3-lcn", source: "google", medium: "cpc", campaign: "lavora_con_noi", startsAt: "12 Gen 2025", impressions: 91500, clicks: 2210, candidates: 128, status: "attiva" },
  { id: "cmp3", name: "Open Day Modena", subtitle: "Evento selezione in sede", cid: "g3-openday-mo", source: "meta", medium: "social", campaign: "open_day_modena", startsAt: "18 Apr 2025", impressions: 22800, clicks: 540, candidates: 41, status: "conclusa" },
  { id: "cmp4", name: "Referral Staff", subtitle: "Porta un amico", cid: "g3-ref", source: "diretto", medium: "referral", campaign: "referral_staff", startsAt: "03 Mar 2025", impressions: 12400, clicks: 610, candidates: 52, status: "attiva" },
  { id: "cmp5", name: "Banqueting Autunno", subtitle: "Personale eventi Q4", cid: "g3-banq-aut", source: "instagram", medium: "social", campaign: "banqueting_autunno", startsAt: "20 Lug 2025", impressions: 8600, clicks: 180, candidates: 9, status: "in pausa" },
];

// Utility riusate dai pannelli.
export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function cityName(slug: string): string {
  return CITIES.find((c) => c.slug === slug)?.name ?? slug;
}
