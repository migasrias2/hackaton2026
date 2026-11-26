import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Dimension } from "../data";

const LINES = (t: Record<Dimension, string>) => [
  "Reading your three words…",
  `Shaping a ${t.personality.toLowerCase()} head…`,
  `Giving the body ${t.power.toLowerCase()} power…`,
  `Arms that carry ${t.character.toLowerCase()}…`,
  "Writing your tagline…",
];

export function Generating({ tags, work, onDone }: { tags: Record<Dimension, string>; work: () => Promise<void>; onDone: () => void }) {
  const lines = LINES(tags);
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => Math.min(n + 1, lines.length - 1)), 750);
    let alive = true;
    const minTime = new Promise((r) => setTimeout(r, 3600));
    Promise.all([work(), minTime]).then(() => alive && onDone());
    return () => {
      alive = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-screen m-bg-dark m-gen">
      <h2 className="m-title m-title--light m-gen__title">
        Generating
        <br />
        your MighT
      </h2>
      <div className="m-gen__fig">
        <div className="m-gen__blob" />
        <div className="m-gen__shine" />
      </div>
      <div className="m-gen__status">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
          >
            {lines[i]}
          </motion.p>
        </AnimatePresence>
        <div className="m-gen__bar">
          <motion.div
            className="m-gen__barfill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: (i + 1) / lines.length }}
            transition={{ type: "spring", bounce: 0, duration: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
}
