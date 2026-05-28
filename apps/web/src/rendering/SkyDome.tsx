import { useMemo } from "react";
import * as THREE from "three";

interface SkyParams {
  sunAngle: number;
}

export function SkyDome({ sunAngle }: SkyParams) {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(200, 48, 24);

    const zenithColor = new THREE.Color("#2c3e80");
    const horizonColor = new THREE.Color("#f4a460");
    const nadirColor = new THREE.Color("#3a3a5c"); // soft dark, not black

    const t = Math.max(0, Math.min(1, sunAngle / (Math.PI / 2)));
    const skyZenith = new THREE.Color().lerpColors(
      new THREE.Color("#f4a460"),
      zenithColor,
      t,
    );

    const colors: number[] = [];
    const positions = g.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      const normalizedY = (y / 200 + 1) / 2;

      let color: THREE.Color;
      if (y > 0) {
        color = new THREE.Color().lerpColors(horizonColor, skyZenith, normalizedY);
      } else {
        const belowT = Math.abs(y) / 200;
        color = new THREE.Color().lerpColors(horizonColor, nadirColor, belowT);
      }
      colors.push(color.r, color.g, color.b);
    }

    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [sunAngle]);

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}
