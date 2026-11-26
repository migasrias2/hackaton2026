import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo, type Variants } from "motion/react";
import { useState } from "react";
import { NETWORK_QUESTIONS, type Answer, type NetworkId } from "../data";
import { haptic } from "../might";
import { TopBar } from "../ui";

interface Props {
  answers: Partial<Record<NetworkId, Answer>>;
  onAnswer: (id: NetworkId, a: Answer) => void;
  onBack: () => void;
  onDone: () => void;
}

const EXIT: Record<Answer, { x: number; y: number; rotate: number }> = {
  yes: { x: 420, y: 40, rotate: 16 },
  no: { x: -420, y: 40, rotate: -16 },
  maybe: { x: 0, y: -520, rotate: 0 },
};

const CARD: Variants = {
  enter: { scale: 0.95, y: 14, opacity: 0 },
  center: { scale: 1, y: 0, opacity: 1 },
  exit: (a: Answer) => ({ ...EXIT[a], opacity: 0, transition: { type: "spring", bounce: 0, duration: 0.45 } }),
};

/** The 5 social-graph questions as a swipeable deck: right = Yes, left = No, or tap a button. */
export function ConnectStep({ answers, onAnswer, onBack, onDone }: Props) {
  const firstOpen = NETWORK_QUESTIONS.findIndex((q) => !answers[q.id]);
  const [i, setI] = useState(firstOpen === -1 ? 0 : firstOpen);
  const [last, setLast] = useState<Answer>("yes");

  const answer = (a: Answer) => {
    haptic(10);
    setLast(a);
    onAnswer(NETWORK_QUESTIONS[i].id, a);
    if (i === NETWORK_QUESTIONS.length - 1) setTimeout(onDone, 320);
    setI((n) => Math.min(n + 1, NETWORK_QUESTIONS.length));
  };

  return (
    <div className="m-screen m-bg-light m-connect">
      <TopBar onBack={i === 0 ? onBack : () => setI((n) => n - 1)} step={4} total={5} />
      <div>
        <p className="m-eyebrow">How you connect</p>
        <h2 className="m-title m-title--sm">Five quick ones about you and your people.</h2>
      </div>

      <div className="m-deck">
        {NETWORK_QUESTIONS.slice(i + 1, i + 3)
          .reverse()
          .map((q, k, arr) => {
            const depth = arr.length - k; // 1 = right behind
            return (
              <motion.div
                key={q.id}
                className="m-qcard m-qcard--back"
                animate={{ scale: 1 - depth * 0.05, y: depth * 24, opacity: 1 - depth * 0.25 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            );
          })}
        <AnimatePresence custom={last}>
          {i < NETWORK_QUESTIONS.length && (
            <QuestionCard key={NETWORK_QUESTIONS[i].id} index={i} value={answers[NETWORK_QUESTIONS[i].id]} onAnswer={answer} />
          )}
        </AnimatePresence>
      </div>

      <div className="m-answers">
        {(["no", "maybe", "yes"] as Answer[]).map((a) => (
          <motion.button
            key={a}
            className={`m-ans m-ans--${a}`}
            whileTap={{ scale: 0.92 }}
            onClick={() => i < NETWORK_QUESTIONS.length && answer(a)}
          >
            {a === "yes" ? "Yes" : a === "no" ? "No" : "Maybe"}
          </motion.button>
        ))}
      </div>
      <p className="m-fineprint m-fineprint--dark">Swipe right for yes, left for no</p>
    </div>
  );
}

function QuestionCard({ index, value, onAnswer }: { index: number; value?: Answer; onAnswer: (a: Answer) => void }) {
  const q = NETWORK_QUESTIONS[index];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const yesO = useTransform(x, [20, 110], [0, 1]);
  const noO = useTransform(x, [-110, -20], [1, 0]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = info.offset.x + info.velocity.x * 0.2;
    if (projected > 120) onAnswer("yes");
    else if (projected < -120) onAnswer("no");
  };

  return (
    <motion.div
      className="m-qcard"
      style={{ x, rotate }}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      variants={CARD}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
    >
      <motion.span className="m-stamp m-stamp--yes" style={{ opacity: yesO }}>
        Yes
      </motion.span>
      <motion.span className="m-stamp m-stamp--no" style={{ opacity: noO }}>
        No
      </motion.span>
      <span className="m-qcard__num">
        {String(index + 1).padStart(2, "0")} / {String(NETWORK_QUESTIONS.length).padStart(2, "0")}
      </span>
      <span className="m-qcard__tag">{q.tag}</span>
      <p className="m-qcard__q">{q.question}</p>
      {value && <span className="m-qcard__prev">You said: {value}</span>}
    </motion.div>
  );
}
