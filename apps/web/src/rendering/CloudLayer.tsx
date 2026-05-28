/* eslint-disable react-hooks/purity */
import { useMemo } from "react";
import * as THREE from "three";

interface CloudLayerParams {
  /** Altitude of this cloud layer. */
  altitude: number;
  /** Radius of the cloud ring/dome. */
  radius: number;
  /** Number of cloud clumps. */
  count: number;
  /** Base color of clouds. */
  color: string;
  /** Opacity of the cloud material. */
  opacity: number;
}

/**
 * A ring of flat cloud planes at a given altitude.
 * Creates stylized lowpoly cloud layers circling the world.
 */
export function CloudLayer({
  altitude,
  radius,
  count,
  color,
  opacity,
}: CloudLayerParams) {
  const clouds = useMemo(() => {
    const items: { position: [number, number, number]; rotation: [number, number, number]; scale: number }[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const r = radius + (Math.random() - 0.5) * radius * 0.3;

      items.push({
        position: [Math.cos(angle) * r, altitude + (Math.random() - 0.5) * 30, Math.sin(angle) * r],
        rotation: [0, angle + Math.PI / 2, (Math.random() - 0.5) * 0.2],
        scale: 8 + Math.random() * 25,
      });
    }
    return items;
  }, [altitude, radius, count]);

  // Shared geometry — thin plane
  const geo = useMemo(() => new THREE.PlaneGeometry(20, 5), []);

  return (
    <group>
      {clouds.map((c, i) => (
        <mesh
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={[c.scale, 1, 1]}
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
