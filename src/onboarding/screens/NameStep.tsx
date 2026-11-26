import { motion } from "motion/react";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Button, TopBar } from "../ui";

export function NameStep({ initial, onBack, onNext }: { initial: string; onBack: () => void; onNext: (name: string) => void }) {
  const [name, setName] = useState(initial);
  const clean = name.trim().split(/\s+/)[0] ?? "";
  const valid = clean.length >= 2;

  return (
    <form
      className="m-screen m-bg-blue m-name"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onNext(clean);
      }}
    >
      <TopBar onBack={onBack} />
      <div className="m-name__body">
        <p className="m-eyebrow">Let's start with you</p>
        <h2 className="m-title">What should we call you?</h2>
        <motion.input
          className="m-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          autoFocus
          autoComplete="given-name"
          enterKeyHint="next"
          maxLength={24}
          whileFocus={{ scale: 1.01 }}
        />
        <div className="m-trust">
          <Lock size={14} strokeWidth={2.4} />
          <span>First name only. Your MighT stays private until you choose to share it.</span>
        </div>
      </div>
      <div className="m-footer">
        <Button type="submit" disabled={!valid}>
          Continue
        </Button>
      </div>
    </form>
  );
}
