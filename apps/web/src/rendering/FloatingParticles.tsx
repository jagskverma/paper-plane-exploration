import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FloatingParticlesParams {
  /** Number of particles. */
  count: number;
  /** Radius of the particle field around origin. */
  spread: number;
  /** Color of particles. */
  color: string;
  /** Size of each particle. */
  size: number;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * Floating dust/pollen particles for atmospheric depth.
 * Gently drifting upward, creating parallax depth cues.
 */
export function FloatingParticles({
  count,
  spread,
  color,
  size,
}: FloatingParticlesParams) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, resetXZ, velocities } = useMemo(() => {
    const random = createSeededRandom(count * 1000 + spread * 10);
    const pos = new Float32Array(count * 3);
    const resets = new Float32Array(count * 2);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (random() - 0.5) * spread * 2;
      pos[i * 3 + 1] = random() * spread;
      pos[i * 3 + 2] = (random() - 0.5) * spread * 2;
      resets[i * 2] = (random() - 0.5) * spread * 2;
      resets[i * 2 + 1] = (random() - 0.5) * spread * 2;
      vel[i] = 0.3 + random() * 0.7; // upward drift speed
    }
    return { positions: pos, resetXZ: resets, velocities: vel };
  }, [count, spread]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, size],
  );

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Drift upward
      pos[i * 3 + 1] += velocities[i] * delta * 0.5;

      // Gentle horizontal sway
      pos[i * 3] += Math.sin(Date.now() * 0.001 + i) * delta * 0.2;

      // Wrap around when reaching top
      if (pos[i * 3 + 1] > spread) {
        pos[i * 3 + 1] = -spread * 0.5;
        pos[i * 3] = resetXZ[i * 2];
        pos[i * 3 + 2] = resetXZ[i * 2 + 1];
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geo} material={mat} />;
}
