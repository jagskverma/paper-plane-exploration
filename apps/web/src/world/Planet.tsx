import { useMemo } from "react";
import * as THREE from "three";

const PLANET_RADIUS = 4000;

/**
 * Simple spherical planet — solid color with a wireframe overlay
 * for surface readability. This is a placeholder; cube-sphere terrain
 * replaces it in Phase 5+.
 */
export function Planet() {
  const geo = useMemo(() => new THREE.SphereGeometry(PLANET_RADIUS, 48, 36), []);

  return (
    <group>
      {/* Solid surface */}
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#4a7a5c"
          roughness={0.8}
          flatShading
        />
      </mesh>

      {/* Subtle wireframe for surface readability */}
      <mesh geometry={geo}>
        <meshBasicMaterial
          color="#3a5a4a"
          wireframe
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export { PLANET_RADIUS };
