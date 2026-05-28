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

      {/* High-altitude clouds — scattered across the sky */}
      <CloudLayer
        altitude={90}
        radius={180}
        count={60}
        color="#f8faff"
        opacity={0.35}
        puffSize={20}
      />

      {/* Mid-altitude clouds — more substantial */}
      <CloudLayer
        altitude={55}
        radius={150}
        count={50}
        color="#eef0ff"
        opacity={0.4}
        puffSize={18}
      />

      {/* Low clouds — closer, more visible */}
      <CloudLayer
        altitude={25}
        radius={120}
        count={40}
        color="#e0e4f8"
        opacity={0.35}
        puffSize={14}
      />

      {/* Atmospheric particles for depth */}
      <FloatingParticles
        count={300}
        spread={120}
        color="#ffe8d0"
        size={0.25}
      />
    </>
  );
}
