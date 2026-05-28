/* eslint-disable react-hooks/refs */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SkyDome } from "./SkyDome";
import { SunLight } from "./SunLight";
import { HeightFog } from "./HeightFog";
import { CloudLayer } from "./CloudLayer";
import { FloatingParticles } from "./FloatingParticles";

export function Atmosphere() {
  // Fixed mid-day sun angle — blue sky
  const sunAngleRef = useRef(Math.PI / 2.5); // ~72°, bright blue sky

  useFrame((_, delta) => {
    // Very slow drift for subtle variation
    sunAngleRef.current += delta * 0.005;
  });

  const sunAngle = sunAngleRef.current;

  return (
    <>
      <SkyDome sunAngle={sunAngle} />
      <SunLight sunAngle={sunAngle} />
      <HeightFog sunAngle={sunAngle} />

      {/* Low scattered clouds — fly right through them */}
      <CloudLayer altitude={40} radius={100} count={25}
        color="#f0f4ff" opacity={0.3} />

      {/* Mid cloud layer — visible above */}
      <CloudLayer altitude={80} radius={120} count={20}
        color="#e8f0ff" opacity={0.35} />

      {/* High cloud layer — clearly in the sky */}
      <CloudLayer altitude={130} radius={150} count={15}
        color="#e0ecff" opacity={0.4} />

      {/* Depth particles */}
      <FloatingParticles count={200} spread={100} color="#ffffff" size={0.3} />
    </>
  );
}
