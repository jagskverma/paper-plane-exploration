import { useMemo } from "react";
import * as THREE from "three";

interface CloudLayerParams {
  altitude: number;
  radius: number;
  count: number;
  color: string;
  opacity: number;
  /** Size of individual cloud puffs. */
  puffSize: number;
}

/**
 * Soft cloud layer using sprite particles instead of hard geometry.
 * Scattered cloud puffs at a given altitude with soft radial fade.
 */
export function CloudLayer({
  altitude,
  radius,
  count,
  color,
  opacity,
  puffSize,
}: CloudLayerParams) {
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const r = radius + (Math.random() - 0.5) * radius * 0.3;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = altitude + (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      siz[i] = puffSize * (0.5 + Math.random() * 1.0);
    }
    return { positions: pos, sizes: siz };
  }, [altitude, radius, count, puffSize]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, [positions, sizes]);

  // Soft radial gradient texture for cloud puffs
  const texture = useMemo(() => createCloudTexture(), []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: texture,
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.NormalBlending,
        sizeAttenuation: true,
      }),
    [texture, color, opacity],
  );

  return <points geometry={geo} material={mat} />;
}

/** Creates a soft radial gradient texture for cloud sprite particles. */
function createCloudTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Radial gradient: opaque center fading to transparent edge
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
  gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}
