import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ARTISTS } from "../data";
import { Button, Logo } from "../ui";

export function Welcome({ onStart }: { onStart: () => void }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % ARTISTS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="m-screen m-bg-blue m-welcome">
      <motion.div
        className="m-welcome__head"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.7, delay: 0.1 }}
      >
        <Logo tone="black" className="m-welcome__logo" />
      </motion.div>

      <div className="m-welcome__stage">
        <div className="m-halo" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={ARTISTS[i].id}
            src={ARTISTS[i].figure}
            alt=""
            className="m-welcome__figure"
            draggable={false}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06, y: -10, filter: "blur(8px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.8 }}
          />
        </AnimatePresence>
        <motion.div key={`n-${i}`} className="m-welcome__artist" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Art · {ARTISTS[i].name}
        </motion.div>
      </div>

      <motion.div
        className="m-welcome__copy"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.8, delay: 0.25 }}
      >
        <h1 className="m-display">
          Reveal your
          <br />
          potential.
        </h1>
        <p className="m-lede">Three words. One figure. You, through the eyes of the people who know you best.</p>
        <Button onClick={onStart}>Get started</Button>
        <p className="m-fineprint">Under 2 minutes · No account needed</p>
      </motion.div>
    </div>
  );
}
