import { useMemo } from "react";
import * as THREE from "three";

interface CloudLayerParams {
  /** Center altitude of this cloud ring. */
  altitude: number;
  /** Radius of the ring. */
  radius: number;
  /** How many cloud planes. */
  count: number;
  /** Tint color. */
  color: string;
  /** Opacity of cloud material. */
  opacity: number;
}

/**
 * Ring of large flat cloud planes scattered at a given altitude.
 * Designed to be seen from below — the plane flies under the clouds.
 */
export function CloudLayer({
  altitude,
  radius,
  count,
  color,
  opacity,
}: CloudLayerParams) {
  const clouds = useMemo(() => {
    const items: {
      position: [number, number, number];
      scale: [number, number, number];
    }[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const r = radius + (Math.random() - 0.5) * radius * 0.4;
      const y = altitude + (Math.random() - 0.5) * 20;

      items.push({
        position: [
          Math.cos(angle) * r,
          y,
          Math.sin(angle) * r,
        ],
        scale: [
          15 + Math.random() * 40,
          1,
          5 + Math.random() * 15,
        ],
      });
    }
    return items;
  }, [altitude, radius, count]);

  // Shared plane geometry — horizontal, facing up
  const geo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  return (
    <group>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          position={c.position}
          rotation={[-Math.PI / 2, 0, 0]} // horizontal, facing up
          scale={c.scale}
          geometry={geo}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
