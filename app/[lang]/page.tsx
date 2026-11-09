import Image from "next/image";
import site from "@/data/site.json";
import stats from "@/data/stats.json";
import destinations from "@/data/destinations.json";
import realisations from "@/data/realisations.json";
import menus from "@/data/menus.json";
import { QuoteForm } from "@/components/QuoteForm";
import { BookingBar, PrefillLink } from "@/components/BookingBar";
import { ArrowIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Emblem, Knife } from "@/components/Logo";
import { LoopVideo } from "@/components/LoopVideo";
import { Reveal } from "@/components/Reveal";
import { altOf, fill, getDict, type Dict, type Locale } from "@/lib/i18n";
import { homeJsonLd } from "@/lib/jsonld";
import { img } from "@/lib/media";
import { shekels, telHref, waLink, type Experience } from "@/lib/quote";

function Photo({ d, src, sizes, className = "", priority = false, alt }: { d: Dict; src: string; sizes: string; className?: string; priority?: boolean; alt?: string }) {
  return <Image src={img(src).src} alt={alt ?? altOf(d, src)} fill sizes={sizes} quality={70} priority={priority} className={`object-cover ${className}`} />;
}

function SectionHead({ eyebrow, title, text, center = false, id }: { eyebrow: string; title: string; text?: string; center?: boolean; id?: string }) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-5 text-[2.6rem] md:text-[4rem]">
        {title}
      </h2>
      {text && <p className={`lead mt-6 ${center ? "mx-auto max-w-xl" : ""}`}>{text}</p>}
    </Reveal>
  );
}

const EXP_IMAGES: Record<Experience, string> = {
  dinner: "/media/evenements/carpaccio.jpg",
  event: "/media/evenements/station-piscine-nuit.jpg",
  travel: "/media/destinations/thailande/plage-thailande.jpg",
  masterclass: "/media/viandes/picanha-tranchee.jpg",
};

const BLOCKS = [
  { video: "/media/video/tranche.mp4", poster: "/media/viandes/video-tranche.jpg", href: "#menus" },
  { image: "/media/destinations/limassol/hotel-limassol.jpg", href: "#destinations" },
  { video: "/media/video/station.mp4", poster: "/media/evenements/video-station.jpg", href: "#contact", prefill: "event" as Experience },
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  const wa = waLink(d.whatsapp.hello);

  const proofs = [
    { n: String(stats.destinations), label: d.stats.destinations },
    { n: `${stats.years}+`, label: d.stats.years },
    { n: stats.followers, label: d.stats.followers },
    ...(stats.events ? [{ n: `${stats.events}+`, label: d.stats.events }] : []),
    ...(stats.guests ? [{ n: `${stats.guests}+`, label: d.stats.guests }] : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />

      {/* ——— Hero plein écran ——— */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-charcoal-deep" aria-labelledby="hero-title">
        <div className="drift absolute inset-0">
          {/* Grand écran : la photo nette des tomahawks sur la braise ; mobile : la boucle vidéo du grill (verticale) */}
          <Photo d={d} src="/media/hero/tomahawks-braise.jpg" sizes="100vw" priority className="object-[50%_45%]" />
          <LoopVideo src="/media/video/grill.mp4" label={d.hero.video} fade className="absolute inset-0 h-full w-full object-cover md:hidden" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,11,10,0.75)_0%,rgba(13,11,10,0.25)_32%,rgba(13,11,10,0.55)_64%,rgba(13,11,10,0.97)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 pt-36 pb-28 text-center md:px-10 md:pb-16">
          <p className="eyebrow rise mx-auto !text-cream/85 max-sm:!text-[0.5625rem] max-sm:!tracking-[0.18em]" style={{ animationDelay: "0.2s" }} dir="ltr">
            {d.hero.eyebrow}
          </p>
          <h1 id="hero-title" className="display rise mx-auto mt-6 max-w-4xl text-[3.1rem] leading-[1] md:text-[5.6rem] lg:text-[6.4rem]" style={{ animationDelay: "0.3s" }}>
            {d.hero.title}
          </h1>
          <p className="rise mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-cream/85" style={{ animationDelay: "0.45s" }}>
            {d.hero.text}
          </p>
          <div className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5 md:hidden" style={{ animationDelay: "0.6s" }}>
            <a href="#contact" className="btn-solid min-w-60">
              {d.hero.cta}
            </a>
            <a href="#destinations" className="btn-line min-w-60">
              {d.hero.secondary}
            </a>
          </div>
          <div className="rise mt-12 hidden md:block" style={{ animationDelay: "0.6s" }}>
            <BookingBar />
            <a href="#destinations" className="nav-link mt-6 inline-flex min-h-11 items-center gap-2 text-cream/85 transition-colors hover:text-gold">
              <span className="link-line">{d.hero.secondary}</span>
              <ArrowIcon />
            </a>
          </div>
          <ul className="rise mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-cream/75" style={{ animationDelay: "0.75s" }} aria-label={d.stats.label}>
            {proofs.slice(0, 3).map((p) => (
              <li key={p.label}>
                <span className="num text-gold">{p.n}</span> {p.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Expériences ——— */}
      <section id="experiences" className="mx-auto max-w-[1400px] px-5 pt-24 pb-20 md:px-10 md:pt-32" aria-labelledby="exp-title">
        <SectionHead eyebrow={d.experiences.eyebrow} title={d.experiences.title} id="exp-title" />
        <ul className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {d.experiences.items.map((x, i) => (
            <Reveal as="li" key={x.id} delay={i * 0.08} className="group glow flex flex-col bg-charcoal">
              <div className="shine relative aspect-[4/5]">
                <Photo d={d} src={EXP_IMAGES[x.id as Experience]} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                <span className="num absolute start-5 top-5 text-[0.75rem] text-cream/85">0{i + 1}</span>
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="display text-[1.75rem]">{x.name}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{x.text}</p>
                <PrefillLink prefill={{ experience: x.id as Experience }} className="nav-link mt-6 inline-flex min-h-11 items-center gap-2 text-gold transition-colors hover:text-cream">
                  <span className="link-line">{d.experiences.discover}</span>
                  <ArrowIcon />
                </PrefillLink>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ——— Chiffres ——— */}
      <section className="border-y border-line bg-charcoal-soft" aria-label={d.stats.label}>
        <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-5 py-14 md:grid-cols-4 md:px-10">
          {proofs.map((p) => (
            <li key={p.label} className="text-center">
              <p className="display text-[3.2rem] leading-none text-cream md:text-[4rem]" dir="ltr">
                {p.n}
              </p>
              <p className="mt-3 text-[0.875rem] text-muted">{p.label}</p>
            </li>
          ))}
          <li className="col-span-2 flex items-center justify-center md:col-span-1">
            <a href="#contact" className="btn-solid">
              {d.nav.book}
            </a>
          </li>
        </ul>
      </section>

      {/* ——— Destinations ——— */}
      <section id="destinations" className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32" aria-labelledby="dest-title">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow={d.destinations.eyebrow} title={d.destinations.title} text={d.destinations.text} id="dest-title" />
          <Reveal className="shrink-0">
            <PrefillLink prefill={{ experience: "travel" }} className="btn-line">
              {d.destinations.cta}
            </PrefillLink>
          </Reveal>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {destinations.items.map((x, i) => (
            <Reveal as="li" key={x.id} delay={(i % 3) * 0.08} className="group">
              <div className="shine relative aspect-[3/4] bg-charcoal-soft">
                <Photo d={d} src={x.image} sizes="(min-width: 768px) 30vw, 50vw" />
                <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(13,11,10,0.85)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <h3 className="display text-[1.6rem] leading-none md:text-[2.2rem]">{x.name[lang]}</h3>
                  <p className="mt-2 hidden text-[0.875rem] leading-snug text-cream/80 sm:block">{x.text[lang]}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-center text-[0.875rem] text-muted">{d.destinations.note}</p>
      </section>

      {/* ——— Menus ——— */}
      <section id="menus" className="grain bg-charcoal-soft py-24 md:py-32" aria-labelledby="menus-title">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <SectionHead eyebrow={d.menus.eyebrow} title={d.menus.title} text={d.menus.text} center id="menus-title" />
          <ul className="mt-14 grid gap-6 lg:grid-cols-3">
            {menus.items.map((m, i) => {
              const t = d.menus.items[m.id as keyof Dict["menus"]["items"]];
              return (
                <Reveal as="li" key={m.id} delay={i * 0.08} className="group glow flex flex-col border border-line bg-charcoal">
                  <div className="shine relative aspect-[16/10]">
                    <Photo d={d} src={m.image} sizes="(min-width: 1024px) 33vw, 100vw" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    <h3 className="display text-[2rem]">{t.name}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{t.text}</p>
                    <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-6 text-[0.9375rem]">
                      {t.courses.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-gold" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    {/* À REMPLIR : prix « à partir de » par personne dans data/menus.json (null = sur devis) */}
                    <p className="mt-7 flex flex-wrap items-baseline gap-x-2 border-t border-line pt-5">
                      {m.priceFrom ? (
                        <>
                          <span className="text-[0.875rem] text-muted">{d.menus.from}</span>
                          <span className="display text-[2rem] leading-none">{shekels(m.priceFrom, lang)}</span>
                          <span className="text-[0.875rem] text-muted">{d.menus.perGuest}</span>
                        </>
                      ) : (
                        <span className="text-[0.9375rem] text-gold">{d.menus.onRequest}</span>
                      )}
                      {m.minGuests && <span className="w-full text-[0.8125rem] text-muted">{fill(d.menus.minGuests, { n: m.minGuests })}</span>}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
          <div className="mt-12 text-center">
            <a href="#contact" className="btn-solid">
              {d.menus.cta}
            </a>
          </div>
        </div>
      </section>

      {/* ——— Trois blocs alternés ——— */}
      <section className="mx-auto max-w-[1400px] space-y-24 px-5 py-24 md:space-y-32 md:px-10 md:py-32">
        {d.blocks.map((b, i) => {
          const m = BLOCKS[i];
          return (
            <div key={b.title} className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
              <Reveal className={`relative aspect-[4/5] overflow-hidden bg-charcoal-soft ${i % 2 ? "md:order-2" : ""}`}>
                {m.video ? (
                  <>
                    <Photo d={d} src={m.poster!} sizes="(min-width: 768px) 45vw, 100vw" />
                    <LoopVideo src={m.video} label={altOf(d, m.poster!)} fade className="absolute inset-0 h-full w-full object-cover" />
                  </>
                ) : (
                  <Photo d={d} src={m.image!} sizes="(min-width: 768px) 45vw, 100vw" />
                )}
              </Reveal>
              <Reveal delay={0.1} className="max-w-lg">
                <Knife className="h-4 w-auto text-gold rtl:-scale-x-100" />
                <p className="eyebrow mt-6">{b.eyebrow}</p>
                <h2 className="display mt-4 text-[2.4rem] md:text-[3.4rem]">{b.title}</h2>
                <p className="lead mt-6">{b.text}</p>
                {m.prefill ? (
                  <PrefillLink prefill={{ experience: m.prefill }} className="btn-solid mt-9">
                    {b.cta}
                  </PrefillLink>
                ) : (
                  <a href={m.href} className="btn-line mt-9">
                    {b.cta}
                  </a>
                )}
              </Reveal>
            </div>
          );
        })}
      </section>

      {/* ——— Réalisations ——— */}
      <section id="events" className="border-t border-line bg-charcoal-soft py-24 md:py-32" aria-labelledby="events-title">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <SectionHead eyebrow={d.events.eyebrow} title={d.events.title} text={d.events.text} id="events-title" />
          <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {realisations.items.map((r, i) => (
              <Reveal as="li" key={r.id} delay={(i % 3) * 0.08} className="group">
                <div className="shine relative aspect-[4/3] bg-charcoal">
                  <Photo d={d} src={r.image} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <p className="eyebrow mt-5">{r.type[lang]}</p>
                <h3 className="display mt-2 text-[1.7rem] leading-tight">{r.title[lang]}</h3>
                <p className="mt-2 text-[0.875rem] text-muted">
                  {r.place[lang]}
                  {/* À REMPLIR : nombre de convives dans data/realisations.json */}
                  {r.guests ? ` · ${fill(d.events.guests, { n: r.guests })}` : ""}
                </p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-14 text-center">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line">
              <InstagramIcon className="h-4 w-4" />
              {d.events.more}
            </a>
          </div>
        </div>
      </section>

      {/* ——— À propos ——— */}
      <section id="about" className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-24 md:grid-cols-[5fr_6fr] md:gap-20 md:px-10 md:py-32" aria-labelledby="about-title">
        <Reveal className="relative aspect-[4/5] overflow-hidden bg-charcoal-soft">
          <Photo d={d} src="/media/portrait/ben-tablier.jpg" sizes="(min-width: 768px) 40vw, 100vw" className="object-[50%_20%]" />
        </Reveal>
        <Reveal delay={0.1} className="max-w-xl">
          <p className="eyebrow">{d.about.eyebrow}</p>
          <h2 id="about-title" className="display mt-5 text-[2.8rem] md:text-[4.2rem]" translate="no">
            {d.about.title}
          </h2>
          <p className="lead mt-7">{d.about.p1}</p>
          <p className="lead mt-5">{d.about.p2}</p>
          <blockquote className="mt-9 border-s border-gold ps-6">
            <p className="display text-[1.6rem] leading-snug text-cream/90">{d.about.quote}</p>
          </blockquote>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-solid mt-10">
            <WhatsAppIcon className="h-4 w-4" />
            {d.about.cta}
          </a>
        </Reveal>
      </section>

      {/* ——— Comment ça marche ——— */}
      <section className="border-y border-line bg-charcoal-soft py-24 md:py-28" aria-labelledby="how-title">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <SectionHead eyebrow={d.how.eyebrow} title={d.how.title} id="how-title" center />
          <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-8">
            {d.how.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="border-t border-gold/40 pt-6">
                <span className="num text-[0.8125rem] text-gold">0{i + 1}</span>
                <h3 className="display mt-3 text-[1.6rem]">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Avis ——— */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center md:py-28" aria-labelledby="reviews-title">
        <Emblem className="mx-auto h-12 w-12 text-gold" />
        <p className="eyebrow mt-6">{d.reviews.eyebrow}</p>
        <h2 id="reviews-title" className="display mt-4 text-[2.4rem] md:text-[3.2rem]">
          {d.reviews.title}
        </h2>
        {/* À REMPLIR avec de vrais avis clients (prénom, type d'événement, texte). Aucun avis inventé. */}
        <p className="lead mx-auto mt-6 max-w-lg">{d.reviews.text}</p>
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line mt-9">
          <InstagramIcon className="h-4 w-4" />
          {d.reviews.cta}
        </a>
      </section>

      {/* ——— FAQ ——— */}
      <section className="border-t border-line bg-charcoal-soft py-24 md:py-28" aria-labelledby="faq-title">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-[2fr_3fr] md:px-10">
          <SectionHead eyebrow={d.faq.eyebrow} title={d.faq.title} id="faq-title" />
          <div className="border-t border-line">
            {d.faq.items.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.0625rem] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-[1.4rem] leading-none text-gold transition-transform duration-500 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-6 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Réservation ——— */}
      <section id="contact" className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 md:grid-cols-[2fr_3fr] md:gap-20 md:px-10 md:py-32" aria-labelledby="book-title">
        <div>
          <SectionHead eyebrow={d.book.eyebrow} title={d.book.title} text={d.book.text} id="book-title" />
          <ul className="mt-10 space-y-4 text-[0.9375rem]">
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-gold">
                <WhatsAppIcon className="h-5 w-5 text-gold" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={telHref} className="inline-flex min-h-11 items-center gap-3 hover:text-gold">
                <PhoneIcon className="h-5 w-5 text-gold" />
                <span dir="ltr">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-gold">
                <InstagramIcon className="h-5 w-5 text-gold" />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </li>
          </ul>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-[0.8125rem] text-muted">
            {proofs.slice(0, 3).map((p) => (
              <li key={p.label}>
                <span className="num text-gold">{p.n}</span> {p.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-line bg-charcoal-soft p-6 md:p-12">
          <QuoteForm />
        </div>
      </section>

    </>
  );
}
