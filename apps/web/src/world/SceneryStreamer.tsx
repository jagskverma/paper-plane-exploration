import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import type { TerrainDebugMetrics } from "../core/terrainMetricsRef";
import type { FlightCollisionObstacle } from "../flight/FlightController";
import { chunkKey, type ChunkId } from "../terrain/ChunkId";
import { selectChunks } from "../terrain/TerrainQuadtree";
import {
  STARTER_WOODLAND_SCENERY,
} from "./SceneryCatalog";
import {
  chunkCenterDirection,
  collisionForPlacement,
  generateSceneryPlacementsForChunk,
  type SceneryPlacement,
} from "./SceneryGenerator";

export interface SceneryViewer {
  position: THREE.Vector3;
  forward: THREE.Vector3;
}

interface SceneryStreamerProps {
  viewer: SceneryViewer;
  onMetrics?: (metrics: Pick<
    TerrainDebugMetrics,
    | "activeSceneryChunks"
    | "sceneryObjects"
    | "collidableSceneryObjects"
    | "activeSceneryAssetTypes"
  >) => void;
  onCollisionObstacles?: (obstacles: FlightCollisionObstacle[]) => void;
}

const FORWARD_CHUNK_BUDGET = 52;
const TURN_BUFFER_CHUNK_BUDGET = 32;
const PLACEMENTS_PER_CHUNK = 16;
const VISIBLE_OBJECT_BUDGET = 800;
const COLLISION_RADIUS = 240;
const MAX_FORWARD_CHUNK_ANGLE = 0.75;
const MAX_TURN_BUFFER_ANGLE = 0.42;
const BACKWARD_DOT_LIMIT = -0.85;

function tangentForward(viewer: SceneryViewer) {
  const normal = viewer.position.clone().normalize();
  const forward = viewer.forward.clone().addScaledVector(
    normal,
    -viewer.forward.dot(normal),
  );

  if (forward.lengthSq() < 0.0001) {
    return new THREE.Vector3(0, 0, -1).addScaledVector(normal, normal.z).normalize();
  }

  return forward.normalize();
}

function selectActiveSceneryChunks(viewer: SceneryViewer) {
  const viewerDirection = viewer.position.clone().normalize();
  const forward = tangentForward(viewer);

  const entries = selectChunks()
    .map((chunk) => {
      const centerDirection = chunkCenterDirection(chunk);
      const tangentToChunk = centerDirection.clone().addScaledVector(
        viewerDirection,
        -centerDirection.dot(viewerDirection),
      );
      const forwardDot = tangentToChunk.lengthSq() < 0.0001
        ? 1
        : forward.dot(tangentToChunk.normalize());
      const angle = viewerDirection.angleTo(centerDirection);
      const behindPenalty = forwardDot < 0 ? Math.abs(forwardDot) * 0.03 : 0;

      return {
        chunk,
        angle,
        forwardDot,
        score: angle + behindPenalty,
      };
    });

  const chunks = new Map<string, ChunkId>();
  const addChunk = (chunk: ChunkId) => {
    chunks.set(chunkKey(chunk), chunk);
  };

  entries
    .filter((entry) => (
      entry.angle <= MAX_FORWARD_CHUNK_ANGLE &&
      entry.forwardDot >= BACKWARD_DOT_LIMIT
    ))
    .sort((a, b) => a.score - b.score)
    .slice(0, FORWARD_CHUNK_BUDGET)
    .forEach((entry) => addChunk(entry.chunk));

  entries
    .filter((entry) => entry.angle <= MAX_TURN_BUFFER_ANGLE)
    .sort((a, b) => a.angle - b.angle)
    .slice(0, TURN_BUFFER_CHUNK_BUDGET)
    .forEach((entry) => addChunk(entry.chunk));

  return [...chunks.values()];
}

function buildVisiblePlacements(chunks: ChunkId[]) {
  return chunks
    .flatMap((chunk) => generateSceneryPlacementsForChunk(chunk, PLACEMENTS_PER_CHUNK))
    .slice(0, VISIBLE_OBJECT_BUDGET);
}

function buildCollisionObstacles(
  placements: SceneryPlacement[],
  viewerPosition: THREE.Vector3,
) {
  return placements
    .filter((placement) => (
      placement.position.distanceTo(viewerPosition) <= COLLISION_RADIUS
    ))
    .flatMap(collisionForPlacement);
}

function SceneryObject({ placement }: { placement: SceneryPlacement }) {
  const { scene } = useGLTF(placement.asset.url);
  const { object, anchorOffset } = useMemo(() => {
    const clonedObject = scene.clone(true);
    clonedObject.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clonedObject);
    const center = bounds.getCenter(new THREE.Vector3());

    return {
      object: clonedObject,
      anchorOffset: new THREE.Vector3(-center.x, -bounds.min.y, -center.z),
    };
  }, [scene]);

  return (
    <group position={placement.position} quaternion={placement.rotation}>
      <group scale={[placement.scale, placement.scale, placement.scale]}>
        <primitive object={object} position={anchorOffset} />
      </group>
    </group>
  );
}

function SceneryChunkGroup({
  chunk,
  placements,
}: {
  chunk: ChunkId;
  placements: SceneryPlacement[];
}) {
  return (
    <group name={`scenery-${chunkKey(chunk)}`}>
      {placements.map((placement) => (
        <SceneryObject key={placement.key} placement={placement} />
      ))}
    </group>
  );
}

export function SceneryStreamer({
  viewer,
  onMetrics,
  onCollisionObstacles,
}: SceneryStreamerProps) {
  const activeChunks = useMemo(() => selectActiveSceneryChunks(viewer), [viewer]);
  const placements = useMemo(
    () => buildVisiblePlacements(activeChunks),
    [activeChunks],
  );
  const placementsByChunk = useMemo(() => {
    const groups = new Map<string, {
      chunk: ChunkId;
      placements: SceneryPlacement[];
    }>();

    for (const placement of placements) {
      const key = chunkKey(placement.chunk);
      const group = groups.get(key);
      if (group) {
        group.placements.push(placement);
      } else {
        groups.set(key, {
          chunk: placement.chunk,
          placements: [placement],
        });
      }
    }

    return [...groups.entries()].map(([key, group]) => ({
      key,
      ...group,
    }));
  }, [placements]);
  const collisionObstacles = useMemo(
    () => buildCollisionObstacles(placements, viewer.position),
    [placements, viewer.position],
  );

  useEffect(() => {
    onMetrics?.({
      activeSceneryChunks: activeChunks.length,
      sceneryObjects: placements.length,
      collidableSceneryObjects: collisionObstacles.length,
      activeSceneryAssetTypes: new Set(
        placements.map((placement) => placement.asset.id),
      ).size,
    });
  }, [activeChunks.length, collisionObstacles.length, onMetrics, placements]);

  useEffect(() => {
    onCollisionObstacles?.(collisionObstacles);
  }, [collisionObstacles, onCollisionObstacles]);

  return (
    <group>
      {placementsByChunk.map((group) => (
        <SceneryChunkGroup
          key={group.key}
          chunk={group.chunk}
          placements={group.placements}
        />
      ))}
    </group>
  );
}

for (const asset of STARTER_WOODLAND_SCENERY) {
  useGLTF.preload(asset.url);
}
