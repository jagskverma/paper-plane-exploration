import { TERRAIN_HEIGHT_AMPLITUDE } from "../core/worldConfig";

interface DirectionLike {
  x: number;
  y: number;
  z: number;
}

function wave(direction: DirectionLike, x: number, y: number, z: number, frequency: number) {
  return Math.sin(
    (direction.x * x + direction.y * y + direction.z * z) * frequency,
  );
}

export function evaluateTerrainHeight(direction: DirectionLike) {
  const broad =
    wave(direction, 1.7, 2.3, -1.1, 3.0) * 0.5 +
    wave(direction, -2.1, 1.2, 2.8, 4.5) * 0.3 +
    wave(direction, 3.4, -1.6, 1.9, 7.0) * 0.2;

  const detail =
    wave(direction, 6.1, 2.4, -3.7, 8.5) * 0.15 +
    wave(direction, -4.8, 5.2, 2.2, 11.0) * 0.1;

  const shaped = Math.tanh((broad + detail) * 1.2);
  return shaped * TERRAIN_HEIGHT_AMPLITUDE;
}
