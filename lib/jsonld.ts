import site from "@/data/site.json";
import { getDict, type Locale } from "@/lib/i18n";

/** Données structurées : Person (Ben) + traiteur / chef privé (FoodEstablishment, Caterer), une Service par expérience, FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const he = lang === "he";
  const name = he ? site.nameHe : site.nameLatin;
  const areaServed = [
    { "@type": "Country", name: "Israel" },
    { "@type": "Place", name: "Worldwide" },
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#ben`,
        name,
        alternateName: [site.nameHe, site.nameLatin],
        jobTitle: "Private chef",
        image: `${site.url}/media/portrait/ben-tablier.jpg`,
        telephone: site.phoneIntl.replace(/[\s-]/g, ""),
        sameAs: [site.instagram],
        worksFor: { "@id": `${site.url}/#business` },
      },
      {
        "@type": ["FoodEstablishment", "LocalBusiness"],
        additionalType: "https://en.wikipedia.org/wiki/Caterer",
        "@id": `${site.url}/#business`,
        name: he ? `${site.nameHe} – שף פרטי` : `${site.nameLatin} – Private Chef`,
        alternateName: ["בן בוסקילה שף פרטי", "Ben Buskila Meats", "Ben Buskila Private Chef"],
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: `${site.url}/og.jpg`,
        logo: `${site.url}/icon.svg`,
        telephone: site.phoneIntl.replace(/[\s-]/g, ""),
        servesCuisine: ["Grill", "Steakhouse", "Israeli", "Mediterranean"],
        address: { "@type": "PostalAddress", addressCountry: "IL" },
        areaServed,
        founder: { "@id": `${site.url}/#ben` },
        sameAs: [site.instagram],
      },
      ...d.experiences.items.map((x) => ({
        "@type": "Service",
        name: x.name,
        description: x.text,
        serviceType: "Private chef",
        provider: { "@id": `${site.url}/#business` },
        areaServed,
      })),
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}
