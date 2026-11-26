import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceFrame } from "@/components/DeviceFrame";
import type { Dimension } from "./data";
import { figureFor, generateCopy, saveSelfMight, type SelfMight } from "./might";
import { ArtistStep } from "./screens/ArtistStep";
import { Generating } from "./screens/Generating";
import { Intro } from "./screens/Intro";
import { NameStep } from "./screens/NameStep";
import { PickTag } from "./screens/PickTag";
import { Reveal } from "./screens/Reveal";
import { Welcome } from "./screens/Welcome";
import "./onboarding.css";

const STEPS = ["welcome", "intro", "name", "personality", "power", "character", "artist", "generating", "reveal"] as const;
type Step = (typeof STEPS)[number];

const TONE: Record<Step, "dark" | "light"> = {
  welcome: "dark",
  intro: "dark",
  name: "dark",
  personality: "dark",
  power: "dark",
  character: "dark",
  artist: "dark",
  generating: "light",
  reveal: "light",
};

export default function Onboarding() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [[step, dir], setNav] = useState<[Step, number]>(["welcome", 1]);
  const [firstName, setFirstName] = useState("");
  const [tags, setTags] = useState<Partial<Record<Dimension, string>>>({});
  const [artistId, setArtistId] = useState("originals");
  const [might, setMight] = useState<SelfMight | null>(null);
  const startedAt = useRef(0);
  const pending = useRef<SelfMight | null>(null);

  const go = (to: Step) => setNav(([from]) => [to, STEPS.indexOf(to) >= STEPS.indexOf(from) ? 1 : -1]);
  const full = tags as Record<Dimension, string>;

  const build = async () => {
    const copy = await generateCopy(firstName, full);
    pending.current = {
      firstName,
      tags: full,
      artistId,
      figure: figureFor(artistId, full),
      ...copy,
      createdAt: new Date().toISOString(),
      timeToCreateMs: Date.now() - startedAt.current,
    };
  };

  const screen = () => {
    switch (step) {
      case "welcome":
        return (
          <Welcome
            onStart={() => {
              startedAt.current = Date.now();
              go("intro");
            }}
          />
        );
      case "intro":
        return <Intro onBack={() => go("welcome")} onDone={() => go("name")} />;
      case "name":
        return (
          <NameStep
            initial={firstName}
            onBack={() => go("intro")}
            onNext={(n) => {
              setFirstName(n);
              go("personality");
            }}
          />
        );
      case "personality":
      case "power":
      case "character": {
        const order: Step[] = ["name", "personality", "power", "character", "artist"];
        const i = order.indexOf(step);
        return (
          <PickTag
            dimension={step}
            value={tags[step]}
            chosen={tags}
            onBack={() => go(order[i - 1])}
            onPick={(label) => setTags((t) => ({ ...t, [step]: label }))}
            onNext={() => go(order[i + 1])}
          />
        );
      }
      case "artist":
        return <ArtistStep tags={full} value={artistId} onBack={() => go("character")} onChange={setArtistId} onNext={() => go("generating")} />;
      case "generating":
        return (
          <Generating
            tags={full}
            work={build}
            onDone={() => {
              if (pending.current) {
                saveSelfMight(pending.current);
                setMight(pending.current);
              }
              go("reveal");
            }}
          />
        );
      case "reveal":
        return might ? (
          <Reveal
            might={might}
            onRegenerate={async () => {
              const copy = await generateCopy(might.firstName, might.tags);
              const next = { ...might, ...copy };
              saveSelfMight(next);
              setMight(next);
            }}
            onEdit={() => go("personality")}
            onContinue={() => navigate("/next")}
          />
        ) : null;
    }
  };

  // iOS-style push: new screen slides over from the trailing edge, old one parallaxes back
  const fade = step === "generating" || step === "reveal";
  const variants = {
    enter: (d: number) => (reduce || fade ? { opacity: 0, x: 0, scale: fade ? 1.04 : 1 } : { x: d > 0 ? "100%" : "-28%", opacity: d > 0 ? 1 : 0.6 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => (reduce || fade ? { opacity: 0 } : { x: d > 0 ? "-28%" : "100%", opacity: d > 0 ? 0.6 : 1 }),
  };

  return (
    <DeviceFrame tone={TONE[step]}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={step}
          className="m-layer"
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ zIndex: dir > 0 ? 2 : 1 }}
          transition={{ type: "spring", bounce: 0, duration: fade ? 0.6 : 0.5 }}
        >
          {screen()}
        </motion.div>
      </AnimatePresence>
    </DeviceFrame>
  );
}
