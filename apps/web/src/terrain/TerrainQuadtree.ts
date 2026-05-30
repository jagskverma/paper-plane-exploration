import * as THREE from "three";
import { PLANET_RADIUS } from "../core/worldConfig";
import type { ChunkId, CubeFace } from "./ChunkId";
import {
  childChunks,
  chunkUvBounds,
  chunksPerAxis,
} from "./ChunkId";
import { directionToFaceUv, faceUvToDirection } from "./CubeSphereMapping";

const FACES: CubeFace[] = [0, 1, 2, 3, 4, 5];
const FAR_LEVEL = 2;
const MID_LEVEL = 3;
const NEAR_LEVEL = 4;
const MID_DISTANCE = 800;
const NEAR_DISTANCE = 200;

function chunksAtLevel(level: number) {
  const perAxis = chunksPerAxis(level);
  const ids: ChunkId[] = [];

  for (const face of FACES) {
    for (let y = 0; y < perAxis; y += 1) {
      for (let x = 0; x < perAxis; x += 1) {
        ids.push({ face, level, x, y });
      }
    }
  }

  return ids;
}

function chunkCenterPosition(id: ChunkId) {
  const { u0, v0, u1, v1 } = chunkUvBounds(id);
  const direction = faceUvToDirection(id.face, (u0 + u1) * 0.5, (v0 + v1) * 0.5);
  return direction.multiplyScalar(PLANET_RADIUS);
}

function containsViewer(id: ChunkId, viewerPosition: THREE.Vector3) {
  const viewerFaceUv = directionToFaceUv(viewerPosition.clone().normalize());
  if (viewerFaceUv.face !== id.face) return false;

  const { u0, v0, u1, v1 } = chunkUvBounds(id);
  return (
    viewerFaceUv.u >= u0 &&
    viewerFaceUv.u <= u1 &&
    viewerFaceUv.v >= v0 &&
    viewerFaceUv.v <= v1
  );
}

function shouldSubdivide(id: ChunkId, viewerPosition: THREE.Vector3) {
  if (containsViewer(id, viewerPosition)) return true;

  const distance = chunkCenterPosition(id).distanceTo(viewerPosition);
  if (id.level === FAR_LEVEL) {
    return distance <= MID_DISTANCE;
  }
  if (id.level === MID_LEVEL) {
    return distance <= NEAR_DISTANCE;
  }
  return false;
}

function selectChunk(id: ChunkId, viewerPosition: THREE.Vector3): ChunkId[] {
  if (id.level >= NEAR_LEVEL || !shouldSubdivide(id, viewerPosition)) {
    return [id];
  }

  return childChunks(id).flatMap((child) => selectChunk(child, viewerPosition));
}

export function selectChunks(viewerPosition: THREE.Vector3): ChunkId[] {
  return chunksAtLevel(FAR_LEVEL).flatMap((id) => selectChunk(id, viewerPosition));
}
