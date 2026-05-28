import { useRef, useEffect } from "react";
import type { FlightState } from "../flight/FlightController";

interface DebugHudProps {
  getState: () => FlightState | null;
}

/**
 * Simple HTML overlay showing flight telemetry.
 */
export function DebugHud({ getState }: DebugHudProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) return;
      const s = getState();
      if (!s) return;
      ref.current.textContent =
        `alt: ${s.altitude.toFixed(1)}m | ` +
        `spd: ${s.speed.toFixed(0)} | ` +
        `pos: (${s.position.x.toFixed(0)}, ${s.position.y.toFixed(0)}, ${s.position.z.toFixed(0)})`;
    }, 200);
    return () => clearInterval(interval);
  }, [getState]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: 8,
        left: 8,
        color: "#fff",
        background: "rgba(0,0,0,0.6)",
        padding: "4px 10px",
        borderRadius: 4,
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 100,
        pointerEvents: "none",
      }}
    />
  );
}
