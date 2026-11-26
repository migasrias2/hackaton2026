import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import { DIMENSIONS, DIMENSION_ORDER, type Dimension } from "../data";
import { haptic } from "../might";
import { Silhouette } from "../Silhouette";
import { Button, TopBar } from "../ui";

interface Props {
  dimension: Dimension;
  value?: string;
  chosen: Partial<Record<Dimension, string>>;
  onBack: () => void;
  onPick: (label: string) => void;
  onNext: () => void;
}

export function PickTag({ dimension, value, chosen, onBack, onPick, onNext }: Props) {
  const dim = DIMENSIONS[dimension];
  const step = DIMENSION_ORDER.indexOf(dimension) + 1;
  const [showAll, setShowAll] = useState(() => !!value && !dim.tags.find((t) => t.label === value)?.featured);
  const list = showAll ? dim.tags : dim.tags.filter((t) => t.featured);
  const selected = dim.tags.find((t) => t.label === value);

  const filled = Object.fromEntries(DIMENSION_ORDER.map((d) => [d, !!chosen[d] && d !== dimension])) as Record<Dimension, boolean>;

  return (
    <div className="m-screen m-bg-light m-pick">
      <TopBar onBack={onBack} step={step} />

      <div className="m-pick__head">
        <div>
          <p className="m-eyebrow">
            {dim.title} · {dim.part}
          </p>
          <h2 className="m-title m-title--sm">{dim.question}</h2>
          <p className="m-hint">{dim.hint}</p>
        </div>
        <Silhouette
          active={dimension}
          filled={{ ...filled, [dimension]: !!value }}
          idle="rgba(255,255,255,0.55)"
          className="m-pick__fig"
        />
      </div>

      <div className="m-pick__scroll">
        <motion.div className="m-chips" layout>
          {list.map((tag, i) => {
            const on = tag.label === value;
            return (
              <motion.button
                key={tag.label}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4, delay: Math.min(i, 12) * 0.018 }}
                whileTap={{ scale: 0.95 }}
                className={`m-chip ${on ? "is-on" : ""}`}
                aria-pressed={on}
                onClick={() => {
                  haptic();
                  onPick(tag.label);
                }}
              >
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span
                      className="m-chip__check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.35 }}
                    >
                      <Check size={13} strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
                {tag.label}
              </motion.button>
            );
          })}
        </motion.div>
        {!showAll && (
          <button className="m-more" onClick={() => setShowAll(true)}>
            See all {dim.tags.length} words
          </button>
        )}
      </div>

      <div className="m-footer m-footer--sheet">
        <AnimatePresence mode="wait" initial={false}>
          {selected ? (
            <motion.p
              key={selected.label}
              className="m-quote"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            >
              “{selected.tagline}”
            </motion.p>
          ) : (
            <motion.p key="none" className="m-quote m-quote--empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Pick the word that feels most like you
            </motion.p>
          )}
        </AnimatePresence>
        <Button variant="brand" onClick={onNext} disabled={!value}>
          {step < 3 ? "Next" : "Choose your artist"}
        </Button>
      </div>
    </div>
  );
}
