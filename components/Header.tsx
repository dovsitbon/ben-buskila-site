"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import annonce from "@/data/annonces.json";
import { Emblem, Wordmark } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { telHref } from "@/lib/quote";

const ANNOUNCE_KEY = `buskila-annonce-${annonce.id}`;

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  // Bandeau d'infos (data/annonces.json) : visible tant qu'il n'a pas été fermé
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    let closed = false;
    try {
      closed = localStorage.getItem(ANNOUNCE_KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lu une fois au montage (localStorage)
    setNotice(annonce.active && !closed);
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const home = `/${lang}`;
  const onHero = usePathname() === home && !scrolled && !menu;
  const links = [
    { href: `${home}#experiences`, label: d.nav.experiences },
    { href: `${home}#destinations`, label: d.nav.destinations },
    { href: `${home}#events`, label: d.nav.events },
    { href: `${home}#about`, label: d.nav.about },
    { href: `${home}#contact`, label: d.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-700 ${
          onHero ? "border-b border-cream/15 text-cream" : "border-b border-gold/20 bg-charcoal/94 text-cream backdrop-blur-sm"
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-cream focus:px-4 focus:py-2 focus:text-charcoal">
          {d.nav.skip}
        </a>
        {notice && (
          <div className="relative flex items-center justify-center gap-3 bg-ember-deep px-12 py-2 text-center text-[0.8125rem] leading-snug text-cream" role="region" aria-label={d.announce.close}>
            <p>{annonce.text[lang]}</p>
            <button
              type="button"
              onClick={() => {
                setNotice(false);
                try {
                  localStorage.setItem(ANNOUNCE_KEY, "1");
                } catch {}
              }}
              className="absolute end-2 flex h-9 w-9 items-center justify-center opacity-80 hover:opacity-100"
              aria-label={d.announce.close}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:h-[5.25rem] md:px-10">
          <div className="flex items-center">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center min-[1280px]:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-7 min-[1280px]:flex" aria-label={d.nav.menu}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap transition-opacity duration-500 hover:opacity-60">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href={home} className="flex items-center" aria-label={d.nav.home}>
            <Wordmark />
          </Link>

          <div className="flex items-center justify-end gap-3 md:gap-5">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden lg:flex" />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="-m-2 hidden h-11 w-11 items-center justify-center transition-opacity hover:opacity-60 lg:flex" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={telHref} className="hidden min-h-11 items-center gap-2 text-[0.875rem] transition-opacity hover:opacity-70 xl:flex" aria-label={`${d.nav.call} ${site.phone}`}>
              <PhoneIcon className="h-4 w-4" />
              <span dir="ltr">{site.phone}</span>
            </a>
            <Link
              href={`${home}#contact`}
              className="nav-link hidden min-h-10 items-center rounded-full border border-ember bg-ember px-5 whitespace-nowrap text-cream transition-colors duration-500 hover:border-ember-deep hover:bg-ember-deep sm:flex"
            >
              {d.nav.book}
            </Link>
            <a href={telHref} className="-m-2 flex h-11 w-11 items-center justify-center sm:hidden" aria-label={`${d.nav.call} ${site.phone}`}>
              <PhoneIcon />
            </a>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-charcoal text-cream" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[5.25rem] md:px-10">
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center justify-self-start" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon />
            </button>
            <Wordmark />
            <span />
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-6" aria-label={d.nav.menu}>
            {links.map((l, i) => (
              <div key={l.href} className="fade-up" style={{ animationDelay: `${0.06 * i + 0.1}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className="display text-[2.2rem]">
                  {l.label}
                </Link>
              </div>
            ))}
            <div className="fade-in mt-6" style={{ animationDelay: "0.5s" }}>
              <Link href={`${home}#contact`} onClick={() => setMenu(false)} className="btn-solid">
                {d.nav.book}
              </Link>
            </div>
            <Emblem className="mt-8 h-12 w-12 text-gold" />
          </nav>
          <div className="flex items-center justify-between border-t border-cream/15 px-6 py-4">
            <LangSwitch lang={lang} label={d.nav.language} />
            <a href={telHref} className="flex min-h-11 items-center gap-2 text-sm">
              <PhoneIcon className="h-4 w-4" />
              <span dir="ltr">{site.phone}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
