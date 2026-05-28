/* eslint-disable react-hooks/refs */
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SkyDome } from "./SkyDome";
import { SunLight } from "./SunLight";
import { HeightFog } from "./HeightFog";
import { CloudLayer } from "./CloudLayer";
import { FloatingParticles } from "./FloatingParticles";

export function Atmosphere() {
  const sunAngleRef = useRef(Math.PI / 2.5);

  useFrame((_, delta) => {
    sunAngleRef.current += delta * 0.005;
  });

  const sunAngle = sunAngleRef.current;

  return (
    <>
      <SkyDome sunAngle={sunAngle} />
      <SunLight sunAngle={sunAngle} />
      <HeightFog sunAngle={sunAngle} />

      {/* Low clouds */}
      <CloudLayer
        altitude={35} radius={100} clusters={15} spheresPerCluster={6}
        color="#f4f8ff" opacity={0.2} maxScale={15}
      />

      {/* Mid clouds */}
      <CloudLayer
        altitude={70} radius={130} clusters={12} spheresPerCluster={8}
        color="#f0f6ff" opacity={0.25} maxScale={20}
      />

      {/* High clouds */}
      <CloudLayer
        altitude={120} radius={160} clusters={8} spheresPerCluster={10}
        color="#ecf4ff" opacity={0.3} maxScale={25}
      />

      <FloatingParticles count={200} spread={100} color="#ffffff" size={0.3} />
    </>
  );
}
