import { Link } from "react-router-dom";
import { DeviceFrame } from "@/components/DeviceFrame";
import { clearSelfMight, loadSelfMight } from "@/onboarding/might";
import "@/onboarding/onboarding.css";

/** Hand-off point to step 2 (Send / Ask MighT). Replace with the teammate's screen. */
export default function Next() {
  const m = loadSelfMight();
  return (
    <DeviceFrame tone="dark">
      <div className="m-screen m-bg-blue m-next">
        {m && <img src={m.figure} alt="" className="m-next__fig" />}
        <h2 className="m-title">Step 2 · Send a MighT</h2>
        <p className="m-body">
          {m ? `${m.firstName}'s Self MighT is saved (${m.tags.personality} · ${m.tags.power} · ${m.tags.character}).` : "No MighT yet."} The Send /
          Ask flow plugs in here.
        </p>
        <div className="m-footer">
          <Link
            to="/"
            className="m-btn m-btn--light"
            onClick={() => clearSelfMight()}
          >
            Start over
          </Link>
        </div>
      </div>
    </DeviceFrame>
  );
}
