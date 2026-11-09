// Trie les visuels Instagram (assets/raw/buskila_NNN_<id>.jpg, dans l'ordre du profil), les captures des stories
// à la une (assets/stories/) et les images extraites des reels (assets/frames/) dans assets/<catégorie>/ avec des noms
// lisibles, puis les prépare pour le web dans public/media/<catégorie>/. next/image sert ensuite AVIF/WebP.
//   npm run media
//
// Écartés volontairement : visuels chargés de texte (captures WhatsApp 208/216, montages 211/224, affiches « Good Grill »),
// photos floues ou trop sombres, photos où les invités sont reconnaissables au premier plan (019, 148, 209, 225),
// photos personnelles sans rapport (salle de sport 133, plongée 227).
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const rawFiles = await readdir(path.join(ROOT, "assets/raw"));
const R = (n) => {
  const f = rawFiles.find((x) => x.startsWith(`buskila_${n}_`));
  if (!f) throw new Error(`Publication ${n} introuvable`);
  return `raw/${f}`;
};

// [source (dans assets/), catégorie, nom, recadrage facultatif en fractions {top, bottom}]
const PICKS = [
  // Hero : côtes tomahawk sur la braise (photo nette, grand écran) + affiche de la boucle vidéo
  [R("044"), "hero", "tomahawks-braise"],
  ["frames/poster_grill.jpg", "hero", "video-grill"],

  // Viandes
  [R("014"), "viandes", "pieces-crues-planches"],
  [R("025"), "viandes", "entrecotes-persillees", { top: 0.06, bottom: 0.94 }],
  [R("071"), "viandes", "tomahawk-romarin"],
  [R("086"), "viandes", "carre-agneau-planche"],
  [R("097"), "viandes", "carre-cotes-grille"],
  [R("101"), "viandes", "sauce-versee"],
  [R("104"), "viandes", "tomahawk-couteau"],
  [R("125"), "viandes", "cote-grill"],
  [R("142"), "viandes", "flamme"],
  [R("018"), "viandes", "picanha-tranchee", { top: 0.1, bottom: 0.9 }],
  ["frames/poster_tranche.jpg", "viandes", "video-tranche"],
  ["frames/raw-ribeyes.jpg", "viandes", "entrecotes-ananas"],

  // Événements et tables
  [R("003"), "evenements", "ferme-tentes-jardin", { top: 0.05, bottom: 0.9 }],
  [R("012"), "evenements", "station-jardin"],
  [R("041"), "evenements", "station-buffet-nuit"],
  [R("050"), "evenements", "station-tomahawks-jardin"],
  [R("060"), "evenements", "station-piscine-nuit"],
  [R("065"), "evenements", "station-terrasse"],
  [R("043"), "evenements", "table-entrees"],
  [R("024"), "evenements", "buffet-entrees"],
  [R("006"), "evenements", "assiettes-viandes"],
  [R("009"), "evenements", "carpaccio"],
  [R("042"), "evenements", "salade-fruits-ete"],
  [R("030"), "evenements", "houmous-viande"],
  [R("033"), "evenements", "salade-tomates"],
  [R("038"), "evenements", "kever-rabbi-meir"],
  ["frames/poster_station.jpg", "evenements", "video-station"],

  // Réalisations (événements cités dans ses légendes Instagram)
  [R("001"), "realisations", "liel-yazamut-binyamina", { top: 0.12, bottom: 0.88 }],
  [R("023"), "realisations", "kiryat-yam", { top: 0.1, bottom: 0.85 }],
  [R("017"), "realisations", "brit-buffet", { top: 0.12, bottom: 0.82 }],
  [R("052"), "realisations", "anniversaire-pub", { top: 0.1, bottom: 0.85 }],

  // Portrait
  ["frames/event-wide.jpg", "portrait", "ben-tablier", { top: 0, bottom: 0.82 }],
  [R("002"), "portrait", "ben-evenement"],
  [R("102"), "portrait", "ben-couteau"],
  [R("049"), "portrait", "ben-station"],
  ["raw/buskila_logo.jpg", "portrait", "ben-profil"],

  // Destinations (publications et stories à la une)
  [R("015"), "destinations/bresil", "plage-cheval"],
  [R("016"), "destinations/miami", "piscine-miami"],
  ["stories/limassol.jpg", "destinations/limassol", "hotel-limassol"],
  ["stories/san-andres.jpg", "destinations/san-andres", "palmiers-san-andres"],
  [R("034"), "destinations/colombie", "route-palmiers"],
  [R("035"), "destinations/new-york", "new-york"],
  ["stories/thailand.jpg", "destinations/thailande", "plage-thailande"],
  [R("072"), "destinations/mexique", "isla-mujeres"],
  [R("068"), "destinations/dubai", "dubai-marina"],
];

const sizes = {};
for (const [src, cat, name, crop] of PICKS) {
  const file = path.join(ROOT, "assets", src);
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  await copyFile(file, path.join(ROOT, "assets", cat, `${name}.jpg`));
  let pipe = sharp(file).rotate();
  if (crop) {
    const { width, height } = await sharp(file).metadata();
    const top = Math.round(height * crop.top);
    pipe = pipe.extract({ left: 0, top, width, height: Math.round(height * crop.bottom) - top });
  }
  const max = cat === "hero" ? 2400 : 1600;
  const info = await pipe
    .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public/media", cat, `${name}.jpg`));
  sizes[`/media/${cat}/${name}.jpg`] = [info.width, info.height];
}

// Emplacements prévus pour les photos et vidéos qu'il enverra
for (const dir of ["galerie", "a-recevoir/photos", "a-recevoir/videos"]) await mkdir(path.join(ROOT, "assets", dir), { recursive: true });

// Image de partage (Open Graph) 1200 × 630
await sharp(path.join(ROOT, "assets", R("044")))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og.jpg"));

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 1) + "\n");
console.log(`${PICKS.length} images prêtes`);

// Boucles vidéo silencieuses (public/media/video/) coupées dans les reels avec ffmpeg, sans le son :
//   grill.mp4    reel DcMCQEnNJ1B, 21 s → 26 s (entrecôtes sur la grille), 540 px
//   tranche.mp4  reel DSfZmjMDVIA, 16 s → 24 s (picanha tranchée sur la planche, fumée)
//   station.mp4  reel DeCfiPIqcVT, 27 s → 30,4 s (station, fruits et glace carbonique)
//   ffmpeg -ss <début> -t <durée> -i assets/reels/<id>.mp4 -an -vf "scale=540:-2,fps=30" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart public/media/video/<nom>.mp4
