import { useMemo } from "react";
import * as THREE from "three";

interface HeightFogParams {
  sunAngle: number;
}

export function HeightFog({ sunAngle }: HeightFogParams) {
  const fogColor = useMemo(() => {
    const sunHeight = Math.sin(sunAngle);
    return new THREE.Color().lerpColors(
      new THREE.Color("#aaccff"), // light blue fog
      new THREE.Color("#6699cc"), // deeper blue fog
      Math.max(0.1, sunHeight * 0.7 + 0.3),
    );
  }, [sunAngle]);

  return (
    <>
      <fogExp2 attach="fog" args={[fogColor, 0.00025]} />
      <color attach="background" args={[fogColor]} />
    </>
  );
}
