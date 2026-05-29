import { useRef, useEffect } from "react";
import type { FlightState } from "../flight/FlightController";

interface DebugHudProps {
  getState: () => FlightState | null;
}

export function DebugHud({ getState }: DebugHudProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) return;
      const s = getState();
      if (!s) return;
      const dist = Math.sqrt(
        s.position.x * s.position.x +
        s.position.y * s.position.y +
        s.position.z * s.position.z,
      );
      const euler = { x: 0, y: 0, z: 0 };
      // Quick euler extraction from quaternion
      const q = s.rotation;
      const sinr_cosp = 2 * (q.w * q.x + q.y * q.z);
      const cosr_cosp = 1 - 2 * (q.x * q.x + q.y * q.y);
      euler.x = Math.atan2(sinr_cosp, cosr_cosp);
      const sinp = 2 * (q.w * q.y - q.z * q.x);
      euler.y = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);
      const siny_cosp = 2 * (q.w * q.z + q.x * q.y);
      const cosy_cosp = 1 - 2 * (q.y * q.y + q.z * q.z);
      euler.z = Math.atan2(siny_cosp, cosy_cosp);

      ref.current.textContent =
        `AGL: ${s.altitude.toFixed(1)}m | ` +
        `speed: ${s.speed.toFixed(1)}m/s | ` +
        `bank: ${(s.bankAngle * 180 / Math.PI).toFixed(0)}deg | ` +
        `pitch: ${(s.pitchAngle * 180 / Math.PI).toFixed(0)}deg | ` +
        `dist: ${dist.toFixed(0)} | ` +
        `rot: (${euler.x.toFixed(2)},${euler.y.toFixed(2)},${euler.z.toFixed(2)}) | ` +
        `pos: (${s.position.x.toFixed(0)},${s.position.y.toFixed(0)},${s.position.z.toFixed(0)})`;
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
        background: "rgba(0,0,0,0.7)",
        padding: "4px 10px",
        borderRadius: 4,
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 100,
        pointerEvents: "none",
        maxWidth: "100vw",
        whiteSpace: "nowrap",
      }}
    />
  );
}
