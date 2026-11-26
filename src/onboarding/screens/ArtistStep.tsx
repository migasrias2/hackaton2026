import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ARTISTS, type Dimension } from "../data";
import { figureFor, haptic } from "../might";
import { Button, TopBar } from "../ui";

interface Props {
  tags: Record<Dimension, string>;
  value: string;
  onBack: () => void;
  onChange: (id: string) => void;
  onNext: () => void;
}

export function ArtistStep({ tags, value, onBack, onChange, onNext }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(Math.max(0, ARTISTS.findIndex((a) => a.id === value)));

  // start on the current choice
  useEffect(() => {
    const el = scroller.current;
    const card = el?.children[active] as HTMLElement | undefined;
    if (el && card) el.scrollLeft = card.offsetLeft - (el.clientWidth - card.clientWidth) / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const card = c as HTMLElement;
      const d = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    if (best !== active) {
      setActive(best);
      haptic(4);
      onChange(ARTISTS[best].id);
    }
  };

  const focus = (i: number) => {
    const el = scroller.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <div className="m-screen m-bg-blue m-artist">
      <TopBar onBack={onBack} step={5} total={5} />
      <div className="m-artist__head">
        <p className="m-eyebrow">Last touch</p>
        <h2 className="m-title m-title--sm">Choose your artist</h2>
        <p className="m-hint m-hint--light">Each MighT keeps one artist's style. Swipe to browse.</p>
      </div>

      <div className="m-artist__rail" ref={scroller} onScroll={onScroll}>
        {ARTISTS.map((a, i) => (
          <motion.button
            key={a.id}
            className={`m-artcard ${i === active ? "is-on" : ""}`}
            onClick={() => focus(i)}
            animate={{ scale: i === active ? 1 : 0.86, opacity: i === active ? 1 : 0.55 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <img src={a.id === "originals" ? figureFor("originals", tags) : a.figure} alt="" draggable={false} />
            <span className="m-artcard__name">{a.name}</span>
            <span className="m-artcard__blurb">{a.blurb}</span>
          </motion.button>
        ))}
      </div>

      <div className="m-artist__words">
        <span>{tags.personality}</span>
        <i />
        <span>{tags.power}</span>
        <i />
        <span>{tags.character}</span>
      </div>

      <div className="m-footer">
        <Button onClick={onNext}>Generate my MighT</Button>
      </div>
    </div>
  );
}
