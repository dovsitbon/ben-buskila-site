"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { KNIFE_PATHS } from "@/components/Logo";

const KEY = "buskila-intro";
const TOTAL = 1.5;

// Braises : position horizontale (%), taille (px), délai (s), dérive (px)
const EMBERS = [
  [14, 3, 0, 18], [27, 2, 0.12, -10], [39, 3, 0.05, 8], [52, 2, 0.2, -16], [61, 3, 0.08, 12], [73, 2, 0.16, -6], [86, 3, 0.02, 10],
] as const;

const markSeen = () => {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  document.documentElement.classList.add("intro-seen");
};

/**
 * Ouverture (1,5 s, une fois par session, aucun son) : fond charbon → quelques braises orangées montent →
 * un couteau de chef se dessine au trait doré → « BEN BUSKILA » puis « PRIVATE CHEF » → fondu sur le hero.
 * Masquée d'office si l'utilisateur réduit les animations (script dans le layout + globals.css).
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      markSeen();
      setGone(true);
    }, TOTAL * 1000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <motion.div
      className="intro-curtain flex flex-col items-center justify-center text-cream"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.15, duration: 0.35, ease: "easeOut" }}
    >
      {EMBERS.map(([x, s, d, dx]) => (
        <motion.span
          key={x}
          aria-hidden="true"
          className="absolute bottom-[-8px] rounded-full bg-[#e8743a] shadow-[0_0_8px_2px_rgba(232,116,58,0.6)]"
          style={{ left: `${x}%`, width: s, height: s }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{ y: "-46vh", x: dx, opacity: [0, 1, 0.8, 0] }}
          transition={{ delay: d, duration: 1.2, ease: "easeOut" }}
        />
      ))}

      <svg viewBox="0 0 100 20" className="w-40 md:w-52" aria-hidden="true" fill="none" stroke="var(--color-gold)" strokeWidth="0.9" strokeLinejoin="round">
        {KNIFE_PATHS.map((p, i) => (
          <motion.path key={p} d={p} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.12 + i * 0.08, duration: 0.5, ease: "easeInOut" }} />
        ))}
      </svg>

      <motion.p
        className="mt-8 font-[family-name:var(--font-cormorant)] text-[2.6rem] leading-none tracking-[0.2em] md:text-[3.6rem]"
        dir="ltr"
        translate="no"
        initial={{ opacity: 0, y: 8, letterSpacing: "0.3em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.2em" }}
        transition={{ delay: 0.55, duration: 0.45, ease: "easeOut" }}
      >
        BEN BUSKILA
      </motion.p>
      <motion.p
        className="mt-4 ps-[0.6em] font-[family-name:var(--font-jost)] text-[0.75rem] tracking-[0.6em] text-gold"
        dir="ltr"
        translate="no"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        PRIVATE CHEF
      </motion.p>

      <button
        type="button"
        onClick={() => {
          markSeen();
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 z-10 min-h-11 px-4 text-cream/70 transition-colors hover:text-cream"
      >
        {skipLabel}
      </button>
    </motion.div>
  );
}
