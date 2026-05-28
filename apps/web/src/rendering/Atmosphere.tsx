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

      {/* Low scattered clouds */}
      <CloudLayer altitude={30} radius={130} count={30}
        color="#ffffff" opacity={0.5} puffSize={25} />

      {/* Mid cloud layer */}
      <CloudLayer altitude={60} radius={150} count={25}
        color="#f8faff" opacity={0.4} puffSize={30} />

      {/* High wispy clouds */}
      <CloudLayer altitude={100} radius={180} count={20}
        color="#eef2ff" opacity={0.3} puffSize={35} />

      {/* Depth particles */}
      <FloatingParticles count={200} spread={100} color="#ffffff" size={0.3} />
    </>
  );
}
