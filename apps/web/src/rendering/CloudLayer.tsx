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

interface CloudSphere {
  pos: [number, number, number];
  scale: number;
  opacity: number;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
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
    const random = createSeededRandom(
      altitude * 1000 + radius * 100 + clusters * 10 + spheresPerCluster,
    );
    const data: CloudCluster[] = [];
    for (let i = 0; i < clusters; i++) {
      const angle = (i / clusters) * Math.PI * 2 + (random() - 0.5) * 0.8;
      const r = radius + (random() - 0.5) * radius * 0.4;
      data.push({
        position: [
          Math.cos(angle) * r,
          altitude + (random() - 0.5) * 15,
          Math.sin(angle) * r,
        ],
        scale: 5 + random() * maxScale,
      });
    }
    return data;
  }, [altitude, radius, clusters, spheresPerCluster, maxScale]);

  // Shared sphere geometry for cloud puffs
  const geo = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);

  const spheres = useMemo(() => {
    const random = createSeededRandom(
      altitude * 2000 + radius * 200 + clusters * 20 + spheresPerCluster,
    );
    const data: CloudSphere[] = [];
    for (const cluster of clusterData) {
      for (let j = 0; j < spheresPerCluster; j++) {
        data.push({
          pos: [
            cluster.position[0] + (random() - 0.5) * cluster.scale * 2,
            cluster.position[1] + (random() - 0.5) * cluster.scale,
            cluster.position[2] + (random() - 0.5) * cluster.scale,
          ],
          scale: cluster.scale * (0.3 + random() * 0.7),
          opacity: opacity * (0.6 + random() * 0.4),
        });
      }
    }
    return data;
  }, [altitude, radius, clusters, spheresPerCluster, opacity, clusterData]);

  return (
    <group>
      {spheres.map((s, i) => (
        <mesh
          key={i}
          position={s.pos}
          scale={[s.scale, s.scale * 0.5, s.scale]}
          geometry={geo}
        >
          <meshBasicMaterial
            color={color}
            transparent
            opacity={s.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
