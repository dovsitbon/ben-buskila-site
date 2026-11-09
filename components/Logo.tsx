/**
 * Logo redessiné d'après l'emblème de ses tabliers et de sa station (toque de chef au-dessus de deux couteaux croisés,
 * « BEN BUSKILA · SPECIAL MEATS ») : ici simplifié au trait, sans la tête de mort, pour rester élégant.
 * « BEN BUSKILA » en capitales Cormorant, « PRIVATE CHEF » très espacé, « בן בוסקילה » en Frank Ruhl Libre.
 * Facile à remplacer : changer ces composants et app/icon.svg (favicon).
 */

/** Couteau de chef au trait, pointe à droite (viewBox 0 0 100 20). */
export const KNIFE_PATHS = [
  "M30 6.5H90c5 0 8 1.4 8 3.3C93 14.3 76 16 30 16Z",
  "M25.5 5h4.5v12.5h-4.5Z",
  "M25.5 7.2 5 8.2c-2.8.2-2.8 6.6 0 6.8l20.5 1Z",
];

export function Knife({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 20" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
      {KNIFE_PATHS.map((p) => (
        <path key={p} d={p} />
      ))}
      <circle cx="11" cy="11.6" r="1" />
      <circle cx="19" cy="11.6" r="1" />
    </svg>
  );
}

/** Emblème : toque de chef au-dessus de deux couteaux croisés (viewBox 0 0 64 64). */
export function Emblem({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 27v-5.5a6.5 6.5 0 0 1 2.6-12.4 8 8 0 0 1 14.8 0A6.5 6.5 0 0 1 42 21.5V27Z" />
      <path d="M22 23.5h20" opacity="0.6" />
      <g transform="translate(32 43) rotate(-32) translate(-30 -6) scale(0.6)">
        {KNIFE_PATHS.map((p) => (
          <path key={p} d={p} strokeWidth="2.2" />
        ))}
      </g>
      <g transform="translate(32 43) scale(-1 1) rotate(-32) translate(-30 -6) scale(0.6)">
        {KNIFE_PATHS.map((p) => (
          <path key={p} d={p} strokeWidth="2.2" />
        ))}
      </g>
    </svg>
  );
}

/** Marque du header : emblème + BEN BUSKILA / PRIVATE CHEF. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} translate="no">
      <Emblem className="h-9 w-9 text-gold md:h-10 md:w-10" />
      <span className="flex flex-col items-center leading-none" dir="ltr">
        <span className="font-[family-name:var(--font-cormorant)] text-[1.2rem] font-normal tracking-[0.2em] md:text-[1.4rem]">BEN BUSKILA</span>
        <span className="mt-1 ps-[0.5em] font-[family-name:var(--font-jost)] text-[0.5rem] tracking-[0.55em] text-gold md:text-[0.5625rem]">PRIVATE CHEF</span>
      </span>
    </span>
  );
}

/** Version complète centrée (pied de page). */
export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`} translate="no">
      <Emblem className="h-16 w-16 text-gold" />
      <p className="mt-5 font-[family-name:var(--font-cormorant)] text-[2.3rem] leading-none tracking-[0.18em]" dir="ltr">
        BEN BUSKILA
      </p>
      <p className="mt-3 ps-[0.6em] font-[family-name:var(--font-jost)] text-[0.6875rem] tracking-[0.6em] text-gold" dir="ltr">
        PRIVATE CHEF
      </p>
      <p className="mt-4 font-[family-name:var(--font-frank)] text-[1.6rem] leading-none text-cream/90" dir="rtl" lang="he">
        בן בוסקילה
      </p>
    </div>
  );
}
