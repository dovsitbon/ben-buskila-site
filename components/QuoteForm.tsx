"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { bookingMessage, EXPERIENCES, isoDay, isPhone, PREFILL_EVENT, PREFS, takenDates, waLink, type Experience, type Pref, type Prefill } from "@/lib/quote";

type Errors = Partial<Record<"experience" | "name" | "phone", string>>;

function Field({ label, hint, error, children, id }: { label: ReactNode; hint?: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-[0.8125rem] leading-relaxed text-gold">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-[0.8125rem] text-gold">
          {error}
        </p>
      )}
    </div>
  );
}

function Legend({ n, children }: { n: string; children: ReactNode }) {
  return (
    <legend className="mb-8 flex items-baseline gap-4">
      <span className="num text-[0.8125rem] text-gold">{n}</span>
      <span className="display text-[1.8rem]">{children}</span>
    </legend>
  );
}

/**
 * Réservation : expérience, date, heure, lieu, convives, préférences, budget, coordonnées.
 * Le récapitulatif part sur WhatsApp (972527347626) dans la langue du visiteur. Rien n'est stocké ;
 * l'acompte en ligne est prévu dans lib/payment.ts mais désactivé.
 */
export function QuoteForm() {
  const { lang, d } = useLocale();
  const f = d.book.fields;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [experience, setExperience] = useState<Experience | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [guests, setGuests] = useState("");
  const [prefs, setPrefs] = useState<Pref[]>([]);
  const [prefsNote, setPrefsNote] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  // Barre de réservation du hero et boutons des expériences
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const p = (e as CustomEvent<Prefill>).detail;
      if (p.experience) setExperience(p.experience);
      if (p.date) setDate(p.date);
      if (p.place) setPlace(p.place);
      if (p.guests) setGuests(p.guests);
      setSent(null);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const dateHint = validDate ? (takenDates.has(date) ? f.dateTaken : takenDates.size > 0 ? f.dateFree : undefined) : undefined;

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!experience) e.experience = d.book.pickExperience;
    if (!name.trim()) e.name = d.book.required;
    if (!phone.trim()) e.phone = d.book.required;
    else if (!isPhone(phone)) e.phone = d.book.invalidPhone;
    setErrors(e);
    if (Object.keys(e).length || !experience) {
      const first = (["experience", "name", "phone"] as const).find((k) => e[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    const text = bookingMessage(
      { experience, date: validDate ? date : "", time, place: place.trim(), guests: guests.trim(), prefs, prefsNote: prefsNote.trim(), budget: budget.trim(), name: name.trim(), phone: phone.trim(), message: message.trim() },
      lang,
      d,
    );
    const url = waLink(text);
    window.open(url, "_blank", "noopener");
    setSent(url);
  };

  const err = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const optional = <span className="normal-case tracking-normal opacity-80">({f.optional})</span>;

  if (sent)
    return (
      <div className="fade-in py-6 text-center md:py-10" role="status">
        <p className="display text-[3rem] leading-none text-gold">{d.book.success.thanks}</p>
        <h3 className="display mt-5 text-[1.8rem]">{d.book.success.title}</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{d.book.success.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={sent} target="_blank" rel="noopener noreferrer" className="btn-solid">
            <WhatsAppIcon className="h-4 w-4" />
            {d.book.success.again}
          </a>
          <button type="button" onClick={() => setSent(null)} className="link-line nav-link">
            {d.book.success.reset}
          </button>
        </div>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-14">
      <fieldset className="space-y-6">
        <Legend n="01">{d.book.steps.experience}</Legend>
        <p className="label" id={id("experience")} tabIndex={-1}>
          {f.experience} *
        </p>
        <div role="radiogroup" aria-labelledby={id("experience")} {...(errors.experience ? { "aria-describedby": `${id("experience")}-err` } : {})} className="flex flex-wrap gap-2">
          {EXPERIENCES.map((o) => (
            <label key={o} className="chip">
              <input type="radio" name="experience" value={o} checked={experience === o} onChange={() => setExperience(o)} className="sr-only" />
              {f.experiences[o]}
            </label>
          ))}
        </div>
        {errors.experience && (
          <p id={`${id("experience")}-err`} role="alert" className="text-[0.8125rem] text-gold">
            {errors.experience}
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-8">
        <Legend n="02">{d.book.steps.details}</Legend>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("date")} label={f.date} hint={dateHint}>
            <input id={id("date")} type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" />
          </Field>
          <Field id={id("time")} label={f.time}>
            <input id={id("time")} type="time" step={900} value={time} onChange={(e) => setTime(e.target.value)} className="field" />
          </Field>
          <Field id={id("place")} label={f.place}>
            <input id={id("place")} type="text" autoComplete="address-level2" placeholder={f.placePlaceholder} value={place} onChange={(e) => setPlace(e.target.value)} className="field" maxLength={160} />
          </Field>
          <Field id={id("guests")} label={f.guests}>
            <input id={id("guests")} type="number" inputMode="numeric" min={1} max={5000} value={guests} onChange={(e) => setGuests(e.target.value)} className="field" />
          </Field>
        </div>
        <div>
          <p className="label" id={id("prefs")}>
            {f.prefs} {optional}
          </p>
          <div role="group" aria-labelledby={id("prefs")} className="mt-3 flex flex-wrap gap-2">
            {PREFS.map((p) => (
              <label key={p} className="chip">
                <input type="checkbox" checked={prefs.includes(p)} onChange={(e) => setPrefs((cur) => (e.target.checked ? [...cur, p] : cur.filter((x) => x !== p)))} className="sr-only" />
                {f.prefsOptions[p]}
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("prefsNote")} label={<>{f.prefsNote} {optional}</>}>
            <input id={id("prefsNote")} type="text" placeholder={f.prefsNotePlaceholder} value={prefsNote} onChange={(e) => setPrefsNote(e.target.value)} className="field" maxLength={200} />
          </Field>
          <Field id={id("budget")} label={<>{f.budget} {optional}</>}>
            <input id={id("budget")} type="text" placeholder={f.budgetPlaceholder} value={budget} onChange={(e) => setBudget(e.target.value)} className="field" maxLength={60} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-8">
        <Legend n="03">{d.book.steps.contact}</Legend>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
            <input id={id("name")} type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
          </Field>
          <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
            <input id={id("phone")} type="tel" autoComplete="tel" inputMode="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
          </Field>
        </div>
        <Field id={id("message")} label={<>{f.message} {optional}</>}>
          <textarea id={id("message")} rows={3} placeholder={f.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" maxLength={1500} />
        </Field>
      </fieldset>

      <div>
        <button type="submit" className="btn-solid w-full sm:w-auto">
          <WhatsAppIcon className="h-4 w-4" />
          {d.book.submit}
        </button>
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">{d.book.hint}</p>
      </div>
    </form>
  );
}
