import { animate, motion, useMotionValue, useTransform, type MotionValue, type PanInfo } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Silhouette } from "../Silhouette";
import { Button, TopBar } from "../ui";

// Apple's momentum projection (Designing Fluid Interfaces)
const project = (v: number, d = 0.998) => ((v / 1000) * d) / (1 - d);

interface Slide {
  title: ReactNode;
  body: string;
  art: ReactNode;
}

const SLIDES: Slide[] = [
  {
    title: <>Your MighT is a portrait of you in three words.</>,
    body: "Friends, family and colleagues each pick three words. Together they build a figure that makes your strengths visible.",
    art: (
      <div className="m-fan">
        <img src="/figures/pop-art.webp" alt="" className="m-fan__l" draggable={false} />
        <img src="/figures/retro-mandala.webp" alt="" className="m-fan__r" draggable={false} />
        <img src="/figures/original-9.webp" alt="" className="m-fan__c" draggable={false} />
      </div>
    ),
  },
  {
    title: <>Every word dresses one part of you.</>,
    body: "A word for your personality, one for your power and one for your character.",
    art: (
      <div className="m-anatomy">
        <Silhouette filled={{ personality: true, power: true, character: true }} className="m-anatomy__fig" />
        <span className="m-pin m-pin--head">
          <b>Head</b> Personality
        </span>
        <span className="m-pin m-pin--body">
          <b>Body</b> Power
        </span>
        <span className="m-pin m-pin--arms">
          <b>Arms</b> Character
        </span>
      </div>
    ),
  },
  {
    title: <>Give a MighT, get a MighT.</>,
    body: "Start with yourself, then recognise the people you believe in. When 3 MighTs come back, your All MighT unlocks.",
    art: (
      <div className="m-orbit">
        <img src="/figures/original-9.webp" alt="" className="m-orbit__me" draggable={false} />
        {["/figures/mystic-pink.webp", "/figures/modrian.webp", "/figures/art-deco.webp"].map((src, i) => (
          <img key={src} src={src} alt="" className={`m-orbit__o m-orbit__o--${i}`} draggable={false} />
        ))}
        <div className="m-orbit__count">
          <span>0 / 3</span> to unlock
        </div>
      </div>
    ),
  },
];

export function Intro({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(360);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const progress = useTransform(x, (v) => -v / w);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const go = (i: number, velocity = 0) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIndex(next);
    animate(x, -next * w, { type: "spring", bounce: velocity ? 0.15 : 0, duration: 0.5, velocity });
  };

  useEffect(() => {
    x.set(-index * w);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = x.get() + project(info.velocity.x);
    const target = Math.round(-projected / w);
    go(Math.max(index - 1, Math.min(index + 1, target)), info.velocity.x);
  };

  const last = index === SLIDES.length - 1;

  return (
    <div className="m-screen m-bg-blue m-intro">
      <TopBar onBack={index === 0 ? onBack : () => go(index - 1)} />
      <div className="m-intro__viewport" ref={ref}>
        <motion.div
          className="m-intro__track"
          style={{ x, width: w * SLIDES.length }}
          drag="x"
          dragConstraints={{ left: -(SLIDES.length - 1) * w, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          {SLIDES.map((s, i) => (
            <div className="m-slide" key={i} style={{ width: w }}>
              <div className="m-slide__art">{s.art}</div>
              <h2 className="m-title">{s.title}</h2>
              <p className="m-body">{s.body}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="m-intro__footer">
        <div className="m-dots">
          {SLIDES.map((_, i) => (
            <Dot key={i} i={i} progress={progress} onClick={() => go(i)} />
          ))}
        </div>
        <Button onClick={() => (last ? onDone() : go(index + 1))}>{last ? "Create my MighT" : "Next"}</Button>
        <button className="m-link" onClick={onDone} style={{ visibility: last ? "hidden" : "visible" }}>
          Skip
        </button>
      </div>
    </div>
  );
}

function Dot({ i, progress, onClick }: { i: number; progress: MotionValue<number>; onClick: () => void }) {
  const width = useTransform(progress, (p) => 8 + 18 * Math.max(0, 1 - Math.abs(p - i)));
  const opacity = useTransform(progress, (p) => 0.35 + 0.65 * Math.max(0, 1 - Math.abs(p - i)));
  return <motion.button className="m-dot" style={{ width, opacity }} onClick={onClick} aria-label={`Slide ${i + 1}`} />;
}
