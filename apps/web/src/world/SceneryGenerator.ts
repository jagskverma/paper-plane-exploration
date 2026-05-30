import * as THREE from "three";
import { PLANET_RADIUS } from "../core/worldConfig";
import type { FlightCollisionObstacle } from "../flight/FlightController";
import { evaluateTerrainHeight } from "../procedural/TerrainHeight";
import { chunkKey, chunkUvBounds, type ChunkId } from "../terrain/ChunkId";
import { chunkGridPointToDirection } from "../terrain/CubeSphereMapping";
import {
  STARTER_WOODLAND_SCENERY,
  type SceneryAssetDefinition,
} from "./SceneryCatalog";

export interface SceneryPlacement {
  key: string;
  chunk: ChunkId;
  asset: SceneryAssetDefinition;
  direction: THREE.Vector3;
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  scale: number;
}

const START_UP = new THREE.Vector3(0, 1, 0);
const SURFACE_CLEARANCE = 0.12;

export function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function random01(seed: string) {
  const hash = hashString(seed);
  return (hash & 0xfffffff) / 0xfffffff;
}

function assetFor(seed: string) {
  const totalWeight = STARTER_WOODLAND_SCENERY.reduce(
    (sum, asset) => sum + asset.weight,
    0,
  );
  let target = random01(`${seed}:asset`) * totalWeight;

  for (const asset of STARTER_WOODLAND_SCENERY) {
    target -= asset.weight;
    if (target <= 0) return asset;
  }

  return STARTER_WOODLAND_SCENERY[STARTER_WOODLAND_SCENERY.length - 1];
}

function scaleFor(asset: SceneryAssetDefinition, seed: string) {
  return asset.scaleMin + random01(`${seed}:scale`) * (asset.scaleMax - asset.scaleMin);
}

function directionInChunk(chunk: ChunkId, seed: string) {
  const { u0, v0, u1, v1 } = chunkUvBounds(chunk);
  const uMargin = (u1 - u0) * 0.18;
  const vMargin = (v1 - v0) * 0.18;
  const u = u0 + uMargin + random01(`${seed}:u`) * (u1 - u0 - uMargin * 2);
  const v = v0 + vMargin + random01(`${seed}:v`) * (v1 - v0 - vMargin * 2);

  return chunkGridPointToDirection(
    chunk.face,
    u,
    v,
    u,
    v,
    0,
    0,
    1,
  );
}

function transformForDirection(direction: THREE.Vector3, yaw: number) {
  const height = evaluateTerrainHeight(direction);
  const position = direction.clone().multiplyScalar(
    PLANET_RADIUS + height + SURFACE_CLEARANCE,
  );
  const alignToSurface = new THREE.Quaternion().setFromUnitVectors(
    START_UP,
    direction,
  );
  const yawRotation = new THREE.Quaternion().setFromAxisAngle(direction, yaw);

  return {
    position,
    rotation: yawRotation.multiply(alignToSurface),
  };
}

export function chunkCenterDirection(chunk: ChunkId) {
  const { u0, v0, u1, v1 } = chunkUvBounds(chunk);
  return chunkGridPointToDirection(
    chunk.face,
    u0,
    v0,
    u1,
    v1,
    1,
    1,
    2,
  );
}

export function generateSceneryPlacementsForChunk(
  chunk: ChunkId,
  placementsPerChunk: number,
) {
  const placements: SceneryPlacement[] = [];
  const key = chunkKey(chunk);

  for (let index = 0; index < placementsPerChunk; index += 1) {
    const seed = `${key}:${index}`;
    const asset = assetFor(seed);
    const direction = directionInChunk(chunk, seed);
    const transform = transformForDirection(
      direction,
      random01(`${seed}:yaw`) * Math.PI * 2,
    );

    placements.push({
      key: `${key}:${index}`,
      chunk,
      asset,
      direction,
      position: transform.position,
      rotation: transform.rotation,
      scale: scaleFor(asset, seed),
    });
  }

  return placements;
}

export function collisionForPlacement(placement: SceneryPlacement) {
  if (placement.asset.collisionHint === "none") {
    return [] satisfies FlightCollisionObstacle[];
  }

  const surfaceNormal = placement.direction.clone().normalize();
  const height = placement.asset.collisionHeight * placement.scale;

  if (placement.asset.collisionHint === "trunk_canopy") {
    return [
      {
        kind: "capsule",
        base: placement.position.clone(),
        up: surfaceNormal,
        radius: 0.45,
        height: height * 0.48,
      },
      {
        kind: "sphere",
        base: placement.position.clone().addScaledVector(surfaceNormal, height * 0.82),
        up: surfaceNormal,
        radius: placement.asset.collisionRadius * placement.scale,
      },
    ] satisfies FlightCollisionObstacle[];
  }

  return [
    {
      kind: "sphere",
      base: placement.position.clone().addScaledVector(surfaceNormal, height * 0.5),
      up: surfaceNormal,
      radius: placement.asset.collisionRadius * placement.scale,
    },
  ] satisfies FlightCollisionObstacle[];
}
