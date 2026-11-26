import { motion } from "motion/react";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Button, TopBar } from "../ui";

export interface NameInfo {
  firstName: string;
  role: string;
  team: string;
}

export function NameStep({ initial, onBack, onNext }: { initial: NameInfo; onBack: () => void; onNext: (v: NameInfo) => void }) {
  const [name, setName] = useState(initial.firstName);
  const [role, setRole] = useState(initial.role);
  const [team, setTeam] = useState(initial.team);
  const clean = name.trim().split(/\s+/)[0] ?? "";
  const valid = clean.length >= 2;

  return (
    <form
      className="m-screen m-bg-blue m-name"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onNext({ firstName: clean, role: role.trim(), team: team.trim() });
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
        <div className="m-group">
          <label className="m-field">
            <span>Role</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Optional, e.g. Designer" maxLength={40} autoComplete="organization-title" />
          </label>
          <label className="m-field">
            <span>Team</span>
            <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Optional, e.g. Mesa 4" maxLength={40} />
          </label>
        </div>
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
