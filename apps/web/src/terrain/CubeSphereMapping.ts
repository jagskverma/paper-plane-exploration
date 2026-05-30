/**
 * Cube-sphere face mapping utilities.
 *
 * Converts between face-local UV coordinates [0,1] and sphere directions.
 * All functions are pure, deterministic, and side-effect free.
 *
 * Face convention matches the current rendered cube sphere:
 *  0: +X   1: -X   2: +Y   3: -Y   4: +Z   5: -Z
 *
 * UV coordinates are normalized [0,1] on each face.
 *
 * Not wired into rendering yet — these are pure utility functions for the
 * terrain subsystem (Phase 7 and later).
 */

import * as THREE from "three";
import type { CubeFace } from "./ChunkId";

export interface FaceUv {
  face: CubeFace;
  u: number;
  v: number;
}

/** Convert face UV [0,1] to an unnormalized cube point. */
export function faceUvToCubePoint(face: CubeFace, u: number, v: number): THREE.Vector3 {
  if (u < 0 || u > 1 || v < 0 || v > 1) {
    throw new Error(`UV out of range: u=${u}, v=${v}`);
  }
  const a = u * 2 - 1; // [-1, 1]
  const b = v * 2 - 1; // [-1, 1]

  switch (face) {
    case 0: return new THREE.Vector3(1, b, a);  // +X
    case 1: return new THREE.Vector3(-1, b, a); // -X
    case 2: return new THREE.Vector3(a, 1, b);  // +Y
    case 3: return new THREE.Vector3(a, -1, b); // -Y
    case 4: return new THREE.Vector3(a, b, 1);  // +Z
    case 5: return new THREE.Vector3(a, b, -1); // -Z
    default: throw new Error(`Invalid face: ${face}`);
  }
}

/** Convert face UV [0,1] to a unit sphere direction. */
export function faceUvToDirection(face: CubeFace, u: number, v: number): THREE.Vector3 {
  return faceUvToCubePoint(face, u, v).normalize();
}

/**
 * Convert a sphere direction to its dominant face and UV coordinates.
 * Chooses the face with the largest absolute axis component.
 */
export function directionToFaceUv(direction: THREE.Vector3): FaceUv {
  const ax = Math.abs(direction.x);
  const ay = Math.abs(direction.y);
  const az = Math.abs(direction.z);

  let face: CubeFace;
  let a: number, b: number;

  if (ax >= ay && ax >= az) {
    face = direction.x >= 0 ? 0 : 1;
    a = direction.z / ax;
    b = direction.y / ax;
  } else if (ay >= ax && ay >= az) {
    face = direction.y >= 0 ? 2 : 3;
    a = direction.x / ay;
    b = direction.z / ay;
  } else {
    face = direction.z >= 0 ? 4 : 5;
    a = direction.x / az;
    b = direction.y / az;
  }

  // Convert from [-1,1] to [0,1]
  return { face, u: (a + 1) * 0.5, v: (b + 1) * 0.5 };
}

/**
 * Map a grid point within a chunk to a sphere direction.
 *
 * `gridX` and `gridY` range from 0 to `resolution` inclusive.
 * `u0,v0,u1,v1` are the chunk's UV bounds (from chunkUvBounds).
 * The grid point is linearly interpolated within the chunk UV range,
 * then converted to a sphere direction.
 */
export function chunkGridPointToDirection(
  face: CubeFace,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  gridX: number,
  gridY: number,
  resolution: number,
): THREE.Vector3 {
  if (resolution < 1 || !Number.isInteger(resolution)) {
    throw new Error(`Invalid resolution: ${resolution}`);
  }
  if (gridX < 0 || gridX > resolution || gridY < 0 || gridY > resolution) {
    throw new Error(`Grid point out of range: (${gridX},${gridY})`);
  }

  const u = u0 + (gridX / resolution) * (u1 - u0);
  const v = v0 + (gridY / resolution) * (v1 - v0);

  return faceUvToDirection(face, u, v);
}
