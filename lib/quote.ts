import site from "@/data/site.json";
import calendar from "@/data/dates.json";
import type { Dict } from "@/lib/i18n";
import { intlLocale, type Locale } from "@/lib/locales";

export const EXPERIENCES = ["dinner", "event", "travel", "masterclass"] as const;
export const PREFS = ["kosher", "meats", "restrictions"] as const;
export type Experience = (typeof EXPERIENCES)[number];
export type Pref = (typeof PREFS)[number];

export const takenDates = new Set<string>(calendar.taken as string[]);

export const isPhone = (v: string) => /^[+\d][\d\s\-().]{7,19}$/.test(v.trim());
export const waLink = (text: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const telHref = `tel:${site.phoneIntl.replace(/[\s-]/g, "")}`;

export const shekels = (n: number, lang: Locale) => new Intl.NumberFormat(intlLocale[lang], { style: "currency", currency: "ILS", maximumFractionDigits: 0 }).format(n);

/** Date du jour au format AAAA-MM-JJ, en heure d'Israël. */
export function isoDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function formatDay(iso: string, lang: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

const colon = (lang: Locale) => (lang === "fr" ? " :" : ":");
const join = (blocks: string[][]) => blocks.map((b) => b.filter(Boolean).join("\n")).filter(Boolean).join("\n\n");

export type Booking = {
  experience: Experience;
  date: string;
  time: string;
  place: string;
  guests: string;
  prefs: Pref[];
  prefsNote: string;
  budget: string;
  name: string;
  phone: string;
  message: string;
};

/** Récapitulatif de réservation envoyé sur WhatsApp, dans la langue du visiteur. */
export function bookingMessage(b: Booking, lang: Locale, d: Dict) {
  const m = d.book.message;
  const f = d.book.fields;
  const c = colon(lang);
  const line = (label: string, value: string) => (value ? `${label}${c} ${value}` : "");
  return join([
    [`*${m.title}*`],
    [line(m.experience, f.experiences[b.experience]), line(m.date, b.date ? formatDay(b.date, lang) : ""), line(m.time, b.time), line(m.place, b.place), line(m.guests, b.guests)],
    [line(m.prefs, b.prefs.map((p) => f.prefsOptions[p]).join(", ")), line(m.notes, b.prefsNote), line(m.budget, b.budget)],
    [line(m.name, b.name), line(m.phone, b.phone), line(m.message, b.message)],
    [m.closing],
  ]);
}

/** Événement envoyé par la barre de réservation du hero et les boutons « Réserver » pour pré-remplir le formulaire. */
export type Prefill = Partial<Pick<Booking, "experience" | "date" | "place" | "guests">>;
export const PREFILL_EVENT = "prefill-booking";
