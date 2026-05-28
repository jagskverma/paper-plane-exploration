/* eslint-disable react-hooks/refs */
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface HeightFogParams {
  sunAngle: number;
}

export function HeightFog({ sunAngle }: HeightFogParams) {
  const { scene } = useThree();
  const setupDone = useRef(false);

  /* eslint-disable react-hooks/immutability */
  if (!setupDone.current) {
    const sunHeight = Math.sin(sunAngle);
    const fogColor = new THREE.Color().lerpColors(
      new THREE.Color("#aaccff"), // light blue fog
      new THREE.Color("#6699cc"), // deeper blue fog
      Math.max(0.1, sunHeight * 0.7 + 0.3),
    );

    scene.fog = new THREE.FogExp2(fogColor, 0.00025);
    scene.background = fogColor;
    setupDone.current = true;
  }
  /* eslint-enable react-hooks/immutability */

  return null;
}
