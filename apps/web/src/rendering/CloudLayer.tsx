import { useMemo } from "react";
import * as THREE from "three";

interface CloudCluster {
  position: [number, number, number];
  scale: number;
}

interface CloudLayerParams {
  altitude: number;
  radius: number;
  clusters: number;
  spheresPerCluster: number;
  color: string;
  opacity: number;
  maxScale: number;
}

/**
 * Cloud clusters made of overlapping spheres for a soft, volumetric look.
 * Each cluster is several overlapping semi-transparent spheres.
 */
export function CloudLayer({
  altitude,
  radius,
  clusters,
  spheresPerCluster,
  color,
  opacity,
  maxScale,
}: CloudLayerParams) {
  const clusterData = useMemo(() => {
    const data: CloudCluster[] = [];
    for (let i = 0; i < clusters; i++) {
      const angle = (i / clusters) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const r = radius + (Math.random() - 0.5) * radius * 0.4;
      data.push({
        position: [
          Math.cos(angle) * r,
          altitude + (Math.random() - 0.5) * 15,
          Math.sin(angle) * r,
        ],
        scale: 5 + Math.random() * maxScale,
      });
    }
    return data;
  }, [altitude, radius, clusters, maxScale]);

  // Shared sphere geometry for cloud puffs
  const geo = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);

  const spheres: { pos: [number, number, number]; s: number }[] = [];
  for (const cluster of clusterData) {
    for (let j = 0; j < spheresPerCluster; j++) {
      spheres.push({
        pos: [
          cluster.position[0] + (Math.random() - 0.5) * cluster.scale * 2,
          cluster.position[1] + (Math.random() - 0.5) * cluster.scale,
          cluster.position[2] + (Math.random() - 0.5) * cluster.scale,
        ],
        s: cluster.scale * (0.3 + Math.random() * 0.7),
      });
    }
  }

  return (
    <group>
      {spheres.map((s, i) => (
        <mesh
          key={i}
          position={s.pos}
          scale={[s.s, s.s * 0.5, s.s]}
          geometry={geo}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={opacity * (0.6 + Math.random() * 0.4)}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
