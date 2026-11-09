// Génère CONTENU.md : tous les textes du site dans les 4 langues, côte à côte, pour validation.
//   node scripts/contenu.mjs
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LANGS = ["he", "en", "fr", "es"];
const NAMES = { he: "Hébreu", en: "Anglais", fr: "Français", es: "Espagnol" };
const dicts = Object.fromEntries(LANGS.map((l) => [l, JSON.parse(readFileSync(path.join(ROOT, "locales", `${l}.json`), "utf8"))]));
const data = (f) => JSON.parse(readFileSync(path.join(ROOT, "data", f), "utf8"));

const flat = (o, p = "", out = []) => {
  if (Array.isArray(o)) o.forEach((v, i) => flat(v, `${p}[${i}]`, out));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) flat(v, p ? `${p}.${k}` : k, out);
  else out.push([p, o]);
  return out;
};
const get = (o, p) => p.split(/\.|\[|\]/).filter(Boolean).reduce((a, k) => a?.[k], o);

let md = `# Ben Buskila – contenus du site (4 langues)\n\nGénéré par \`node scripts/contenu.mjs\` depuis \`locales/*.json\` et \`data/*.json\`. Pour modifier un texte : changer le fichier de langue, puis relancer.\n\n`;
md += `## Titre du hero : 3 propositions\n\nRetenue sur le site : **A**.\n\n| | Hébreu | Anglais | Français | Espagnol |\n|---|---|---|---|---|\n`;
md += `| A | שף פרטי, בכל מקום שתבחרו | Your private chef, wherever you are | Votre chef privé, où que vous soyez | Tu chef privado, donde estés |\n`;
md += `| B | אש, בשר ושולחן ארוך | Fire, meat and a long table | Le feu, la viande et une grande table | Fuego, carne y una mesa larga |\n`;
md += `| C | מהגריל בווילה ועד סיפון היאכטה | From the villa grill to the yacht deck | Du grill de la villa au pont du yacht | De la parrilla de la villa a la cubierta del yate |\n\n`;

const sections = Object.keys(dicts.he).filter((k) => k !== "alt");
for (const s of sections) {
  md += `## ${s}\n\n| Clé | ${LANGS.map((l) => NAMES[l]).join(" | ")} |\n|---|${LANGS.map(() => "---").join("|")}|\n`;
  for (const [k] of flat(dicts.he[s], s)) md += `| \`${k}\` | ${LANGS.map((l) => String(get(dicts[l], k) ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ")} |\n`;
  md += "\n";
}

for (const [file, title] of [["annonces.json", "Bandeau d'infos (data/annonces.json)"], ["destinations.json", "Destinations (data/destinations.json)"], ["realisations.json", "Réalisations (data/realisations.json)"]]) {
  const j = data(file);
  md += `## ${title}\n\n`;
  const rows = j.items ?? [j];
  for (const r of rows) {
    md += `| ${r.id} | ${LANGS.map((l) => NAMES[l]).join(" | ")} |\n|---|${LANGS.map(() => "---").join("|")}|\n`;
    for (const key of ["name", "type", "title", "place", "text"]) if (r[key]) md += `| ${key} | ${LANGS.map((l) => r[key][l]).join(" | ")} |\n`;
    md += "\n";
  }
}

md += `## Textes alternatifs des images (alt)\n\n| Image | ${LANGS.map((l) => NAMES[l]).join(" | ")} |\n|---|${LANGS.map(() => "---").join("|")}|\n`;
for (const k of Object.keys(dicts.he.alt)) md += `| ${k} | ${LANGS.map((l) => dicts[l].alt[k]).join(" | ")} |\n`;

writeFileSync(path.join(ROOT, "CONTENU.md"), md);
console.log("CONTENU.md écrit");
