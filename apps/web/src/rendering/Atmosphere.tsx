/* eslint-disable react-hooks/refs */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SkyDome } from "./SkyDome";
import { SunLight } from "./SunLight";
import { HeightFog } from "./HeightFog";
import { CloudLayer } from "./CloudLayer";
import { FloatingParticles } from "./FloatingParticles";

export function Atmosphere() {
  const sunAngleRef = useRef(Math.PI / 4);

  useFrame((_, delta) => {
    sunAngleRef.current += delta * 0.02;
    if (sunAngleRef.current > Math.PI * 2) {
      sunAngleRef.current -= Math.PI * 2;
    }
  });

  const sunAngle = sunAngleRef.current;

  return (
    <>
      <SkyDome sunAngle={sunAngle} />
      <SunLight sunAngle={sunAngle} />
      <HeightFog sunAngle={sunAngle} />
      <CloudLayer altitude={80} radius={160} count={18} color="#ffffff" opacity={0.15} />
      <CloudLayer altitude={50} radius={140} count={12} color="#f0e8ff" opacity={0.2} />
      <CloudLayer altitude={20} radius={120} count={8} color="#e8e0f0" opacity={0.25} />
      <FloatingParticles count={200} spread={100} color="#ffe8d0" size={0.3} />
    </>
  );
}
