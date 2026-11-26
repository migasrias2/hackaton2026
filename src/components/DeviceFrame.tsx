import type { ReactNode } from "react";

/**
 * On desktop: renders the app inside an iPhone-sized frame (for the stage demo).
 * On a phone / installed PWA: full screen, frame and fake status bar hidden by CSS.
 */
export function DeviceFrame({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <div className="m-stage">
      <div className="m-device">
        <div className={`m-statusbar m-statusbar--${tone}`} aria-hidden>
          <span className="m-statusbar__time">9:41</span>
          <span className="m-island" />
          <span className="m-statusbar__icons">
            <svg width="18" height="11" viewBox="0 0 18 11">
              <rect x="0" y="7" width="3" height="4" rx="1" />
              <rect x="5" y="5" width="3" height="6" rx="1" />
              <rect x="10" y="2.5" width="3" height="8.5" rx="1" />
              <rect x="15" y="0" width="3" height="11" rx="1" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" />
              <rect x="2" y="2" width="18" height="8" rx="2" />
              <rect x="23" y="4" width="1.5" height="4" rx=".75" opacity=".4" />
            </svg>
          </span>
        </div>
        <div className="m-viewport">{children}</div>
        <div className={`m-homebar m-homebar--${tone}`} aria-hidden />
      </div>
    </div>
  );
}
