import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

type BtnProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "light" | "brand" | "ghost" | "glass";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
};

export function Button({ children, onClick, variant = "light", disabled, className = "", type = "button" }: BtnProps) {
  return (
    <motion.button
      type={type}
      className={`m-btn m-btn--${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", bounce: 0, duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}

/** Back button + 3-segment progress for the word pickers (wayfinding). */
export function TopBar({ onBack, step, total = 3, tone = "dark" }: { onBack?: () => void; step?: number; total?: number; tone?: "dark" | "light" }) {
  return (
    <div className={`m-topbar m-topbar--${tone}`}>
      {onBack ? (
        <motion.button className="m-iconbtn" onClick={onBack} whileTap={{ scale: 0.9 }} aria-label="Back">
          <ChevronLeft size={22} strokeWidth={2.4} />
        </motion.button>
      ) : (
        <span className="m-iconbtn m-iconbtn--placeholder" />
      )}
      {step !== undefined && (
        <div className="m-progress" aria-label={`Step ${step} of ${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className="m-progress__seg">
              <motion.div
                className="m-progress__fill"
                initial={false}
                animate={{ scaleX: i < step ? 1 : 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              />
            </div>
          ))}
        </div>
      )}
      <span className="m-iconbtn m-iconbtn--placeholder" />
    </div>
  );
}

export const Logo = ({ tone = "white", className = "" }: { tone?: "white" | "black"; className?: string }) => (
  <img src={`/brand/logo-${tone}.svg`} alt="MighT" className={`m-logo ${className}`} draggable={false} />
);
