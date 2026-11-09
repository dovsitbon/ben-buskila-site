"use client";

import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { waLink } from "@/lib/quote";

/**
 * Mobile : barre fixée en bas de l'écran (« להזמנת שף » + WhatsApp), toujours visible.
 * Ordinateur : pastille WhatsApp discrète (le bouton de réservation est déjà dans l'en-tête).
 */
export function WhatsAppFloat() {
  const { lang, d } = useLocale();
  const wa = waLink(d.whatsapp.hello);
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-px border-t border-gold/25 bg-charcoal/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        <a href={`/${lang}#contact`} className="nav-link flex min-h-14 flex-[1.6] items-center justify-center bg-ember text-cream">
          {d.mobile.book}
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="nav-link flex min-h-14 flex-1 items-center justify-center gap-2 text-cream">
          <WhatsAppIcon className="h-4 w-4" />
          {d.mobile.whatsapp}
        </a>
      </div>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={d.whatsapp.float}
        className="fixed end-8 bottom-8 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-charcoal text-cream transition-colors duration-500 hover:border-gold hover:text-gold md:flex"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
