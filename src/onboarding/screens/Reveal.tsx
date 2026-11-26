import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Lock, Network, RefreshCw, Sparkles, Timer } from "lucide-react";
import { NETWORK_ROLES } from "../data";
import type { SelfMight } from "../might";
import { Button } from "../ui";

const fmt = (ms: number) => {
  const s = Math.max(1, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

interface Props {
  might: SelfMight;
  onRegenerate: () => Promise<void>;
  onEdit: () => void;
  onContinue: () => void;
}

export function Reveal({ might, onRegenerate, onEdit, onContinue }: Props) {
  const [busy, setBusy] = useState(false);
  const s = (delay: number) => ({ type: "spring" as const, bounce: 0, duration: 0.7, delay });

  return (
    <div className="m-screen m-bg-purple m-reveal">
      <motion.div className="m-reveal__chip" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={s(0.9)}>
        <Timer size={13} strokeWidth={2.6} /> Your first MighT in {fmt(might.timeToCreateMs)}
      </motion.div>

      <motion.p className="m-reveal__hello" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={s(0.15)}>
        Meet your MighT,
      </motion.p>
      <motion.h1 className="m-reveal__name" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={s(0.25)}>
        {might.firstName}
      </motion.h1>

      <div className="m-reveal__stage">
        <motion.div
          className="m-burst"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0, duration: 1.2 }}
        />
        <motion.img
          src={might.figure}
          alt={`${might.firstName}'s MighT`}
          className="m-reveal__figure"
          draggable={false}
          initial={{ scale: 0.55, opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.9, delay: 0.1 }}
        />
      </div>

      <motion.div className="m-tagrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={s(0.45)}>
        <span>{might.tags.personality}</span>
        <span>{might.tags.power}</span>
        <span>{might.tags.character}</span>
      </motion.div>

      {might.network && (
        <motion.div className="m-netrole" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={s(0.55)}>
          <Network size={14} strokeWidth={2.4} />
          <b>{NETWORK_ROLES[might.network.role].name}</b>
          <span>{NETWORK_ROLES[might.network.role].line}</span>
        </motion.div>
      )}

      <motion.div className="m-reveal__copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={s(0.6)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={might.tagline}
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.3 }}
          >
            <p className="m-reveal__tagline">“{might.tagline}”</p>
            <p className="m-reveal__bio">{might.bio}</p>
          </motion.div>
        </AnimatePresence>
        <p className="m-reveal__src">
          {might.source === "ai" ? (
            <>
              <Sparkles size={12} /> Written by AI from your words
            </>
          ) : (
            <>From the MighT word library</>
          )}
          <span className="m-sep">·</span>
          <Lock size={11} /> Private
        </p>
      </motion.div>

      <motion.div className="m-reveal__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={s(0.75)}>
        <Button onClick={onContinue}>Send your first MighT</Button>
        <div className="m-reveal__row">
          <Button
            variant="glass"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onRegenerate();
              setBusy(false);
            }}
          >
            <RefreshCw size={15} className={busy ? "m-spin" : ""} /> New tagline
          </Button>
          <Button variant="glass" onClick={onEdit}>
            Edit words
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
