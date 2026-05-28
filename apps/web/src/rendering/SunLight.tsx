import { useRef, useMemo } from "react";
import * as THREE from "three";

interface SunLightParams {
  /** Current sun angle in radians (updates externally or internally). */
  sunAngle: number;
}

/**
 * Animated sun — directional light + ambient that tracks sun position.
 * Produces warm golden-hour tones at low angles, cool blue at zenith.
 */
export function SunLight({ sunAngle }: SunLightParams) {
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const ambRef = useRef<THREE.AmbientLight>(null);

  // Compute sun position: circles in the XZ plane at varying height
  const sunPos = useMemo(() => {
    const radius = 150;
    const x = Math.cos(sunAngle * 0.3) * radius; // slow horizontal drift
    const z = Math.sin(sunAngle * 0.3) * radius;
    const y = Math.sin(sunAngle) * radius;
    return new THREE.Vector3(x, y, z);
  }, [sunAngle]);

  // Color temperature based on sun height
  const sunHeight = Math.sin(sunAngle); // -1 to 1
  const warmth = Math.max(0, 1 - Math.abs(sunHeight) * 0.7);

  const keyColor = useMemo(
    () =>
      new THREE.Color().lerpColors(
        new THREE.Color("#ff8c42"), // warm sunset
        new THREE.Color("#fff8e7"), // cool daylight
        Math.max(0, sunHeight),
      ),
    [sunHeight],
  );

  const ambientColor = useMemo(
    () =>
      new THREE.Color().lerpColors(
        new THREE.Color("#2a1a3e"), // dark purple (night-ish)
        new THREE.Color("#c8d8f0"), // bright blue (day)
        Math.max(0.1, sunHeight * 0.7 + 0.3),
      ),
    [sunHeight],
  );

  const ambientIntensity = 0.3 + Math.max(0, sunHeight) * 0.5;

  return (
    <>
      <directionalLight
        ref={dirRef}
        position={sunPos}
        intensity={1.5 + warmth * 0.8}
        color={keyColor}
        castShadow={false}
      />
      <ambientLight
        ref={ambRef}
        intensity={ambientIntensity}
        color={ambientColor}
      />
    </>
  );
}
