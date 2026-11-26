import { motion } from "motion/react";
import { useId } from "react";
import type { Dimension } from "./data";

const COLORS: Record<Dimension, string> = {
  personality: "#144B86",
  power: "#358EC0",
  character: "#753065",
};

interface Props {
  active?: Dimension | null;
  filled?: Partial<Record<Dimension, boolean>>;
  idle?: string; // fill for untouched parts
  className?: string;
}

/** The MighT base figure: head = personality, body = power, arms = character. */
export function Silhouette({ active = null, filled = {}, idle = "rgba(255,255,255,0.38)", className }: Props) {
  const id = useId().replace(/:/g, "");
  const fillFor = (d: Dimension) => (filled[d] ? COLORS[d] : active === d ? "#ffffff" : idle);
  const spring = { type: "spring", bounce: 0, duration: 0.45 } as const;

  const head = (
    <>
      <ellipse cx="100" cy="66" rx="58" ry="55" />
      <circle cx="44" cy="80" r="30" />
      <circle cx="156" cy="80" r="30" />
    </>
  );

  return (
    <svg viewBox="0 0 200 212" className={className} aria-hidden>
      <defs>
        {/* cuts a transparent gap around the head, whatever the background */}
        <mask id={`gap-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="212">
          <rect width="200" height="212" fill="white" />
          <g fill="black" stroke="black" strokeWidth="12">
            {head}
          </g>
        </mask>
        <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g mask={`url(#gap-${id})`}>
        <motion.g
          animate={{ fill: fillFor("character") }}
          transition={spring}
          filter={active === "character" ? `url(#glow-${id})` : undefined}
        >
          <path d="M45 104 L53 104 L60 190 A13 13 0 0 1 34 190 Z" />
          <path d="M147 104 L155 104 L166 190 A13 13 0 0 1 140 190 Z" />
        </motion.g>
        <motion.path
          d="M64 112 L136 112 L132 196 Q131 207 120 207 L113 207 Q111 192 100 192 Q89 192 87 207 L80 207 Q69 207 68 196 Z"
          animate={{ fill: fillFor("power") }}
          transition={spring}
          filter={active === "power" ? `url(#glow-${id})` : undefined}
        />
      </g>
      <motion.g
        animate={{ fill: fillFor("personality") }}
        transition={spring}
        filter={active === "personality" ? `url(#glow-${id})` : undefined}
      >
        {head}
      </motion.g>
    </svg>
  );
}
