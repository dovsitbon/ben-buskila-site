"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { useLocale } from "@/components/providers";
import { isoDay, PREFILL_EVENT, type Prefill } from "@/lib/quote";

/** Envoie des valeurs au formulaire de réservation puis fait défiler jusqu'à lui. */
export function prefillBooking(p: Prefill) {
  window.dispatchEvent(new CustomEvent<Prefill>(PREFILL_EVENT, { detail: p }));
  const target = document.getElementById("contact");
  const lenis = (window as unknown as { __lenis?: { scrollTo: (el: Element, o?: object) => void } }).__lenis;
  if (target) {
    if (lenis) lenis.scrollTo(target, { offset: -72 });
    else target.scrollIntoView({ behavior: "smooth" });
  }
}

/** Lien « Réserver » qui pré-remplit aussi le type d'expérience. */
export function PrefillLink({ prefill, className = "", children }: { prefill: Prefill; className?: string; children: ReactNode }) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        prefillBooking(prefill);
      }}
    >
      {children}
    </a>
  );
}

/** Barre de réservation du hero : date, lieu ou pays, nombre de convives. */
export function BookingBar() {
  const { d } = useLocale();
  const b = d.hero.bar;
  const uid = useId();
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [guests, setGuests] = useState("");
  const [today, setToday] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    prefillBooking({ date, place: place.trim(), guests: guests.trim() });
  };

  const cell = "flex min-w-0 flex-1 flex-col gap-1 px-5 py-3 text-start";
  const label = "text-[0.625rem] tracking-[0.22em] text-cream/70 uppercase rtl:text-[0.8125rem] rtl:tracking-normal";
  const input = "w-full min-w-0 bg-transparent text-[0.9375rem] text-cream outline-none placeholder:text-cream/45 [&::-webkit-calendar-picker-indicator]:invert-[0.85]";

  return (
    <form onSubmit={onSubmit} aria-label={b.label} className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-[2px] border border-cream/25 bg-charcoal/55 backdrop-blur-md md:flex-row md:items-stretch">
      <label className={cell} htmlFor={`${uid}-d`}>
        <span className={label}>{b.date}</span>
        <input id={`${uid}-d`} type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
      </label>
      <span aria-hidden="true" className="h-px bg-cream/15 md:h-auto md:w-px" />
      <label className={`${cell} md:flex-[1.4]`} htmlFor={`${uid}-p`}>
        <span className={label}>{b.place}</span>
        <input id={`${uid}-p`} type="text" placeholder={b.placePlaceholder} value={place} onChange={(e) => setPlace(e.target.value)} className={input} maxLength={120} />
      </label>
      <span aria-hidden="true" className="h-px bg-cream/15 md:h-auto md:w-px" />
      <label className={`${cell} md:max-w-36`} htmlFor={`${uid}-g`}>
        <span className={label}>{b.guests}</span>
        <input id={`${uid}-g`} type="number" inputMode="numeric" min={1} max={2000} placeholder="12" value={guests} onChange={(e) => setGuests(e.target.value)} className={input} />
      </label>
      <button type="submit" className="nav-link min-h-14 bg-ember px-8 text-cream transition-colors duration-500 hover:bg-ember-deep">
        {b.submit}
      </button>
    </form>
  );
}
