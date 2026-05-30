import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { PLANET_RADIUS } from "../core/worldConfig";
import type { FlightCollisionObstacle } from "../flight/FlightController";
import { evaluateTerrainHeight } from "../procedural/TerrainHeight";
import { chunkKey, chunkUvBounds, type ChunkId } from "../terrain/ChunkId";
import { chunkGridPointToDirection } from "../terrain/CubeSphereMapping";
import { selectChunks } from "../terrain/TerrainQuadtree";

type SceneryAssetUrl =
  | "/scale-test-assets/tree.glb"
  | "/scale-test-assets/pine-tree.glb"
  | "/scale-test-assets/small-rock.glb"
  | "/scale-test-assets/bush.glb";

interface SceneryPlacement {
  asset: SceneryAssetUrl;
  direction: THREE.Vector3;
  scale: number;
  yaw: number;
}

interface ProceduralSceneryProps {
  viewerPosition: THREE.Vector3;
  onObjectCount?: (count: number) => void;
  onCollisionObstacles?: (obstacles: FlightCollisionObstacle[]) => void;
}

const SURFACE_CLEARANCE = 0.12;
const MAX_SCATTERED_OBJECTS = 40;
const START_UP = new THREE.Vector3(0, 1, 0);

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function random01(seed: string) {
  const hash = hashString(seed);
  return (hash & 0xfffffff) / 0xfffffff;
}

function assetFor(seed: string): SceneryAssetUrl {
  const r = random01(`${seed}:asset`);
  if (r < 0.38) return "/scale-test-assets/pine-tree.glb";
  if (r < 0.68) return "/scale-test-assets/tree.glb";
  if (r < 0.86) return "/scale-test-assets/bush.glb";
  return "/scale-test-assets/small-rock.glb";
}

function scaleFor(asset: SceneryAssetUrl, seed: string) {
  const variation = 0.85 + random01(`${seed}:scale`) * 0.3;
  if (asset === "/scale-test-assets/tree.glb") return 0.032 * variation;
  if (asset === "/scale-test-assets/pine-tree.glb") return 6.5 * variation;
  if (asset === "/scale-test-assets/bush.glb") return 18 * variation;
  return 10 * variation;
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

function buildPlacements(viewerPosition: THREE.Vector3) {
  const selectedChunks = selectChunks(viewerPosition)
    .filter((chunk) => chunk.level >= 4);

  const placements: SceneryPlacement[] = [];

  for (const chunk of selectedChunks) {
    for (let index = 0; index < 3; index += 1) {
      const seed = `${chunkKey(chunk)}:${index}`;
      const asset = assetFor(seed);
      placements.push({
        asset,
        direction: directionInChunk(chunk, seed),
        scale: scaleFor(asset, seed),
        yaw: random01(`${seed}:yaw`) * Math.PI * 2,
      });
    }
  }

  return placements.slice(0, MAX_SCATTERED_OBJECTS);
}

function transformForPlacement(placement: SceneryPlacement) {
  const height = evaluateTerrainHeight(placement.direction);
  const surfacePoint = placement.direction.clone().multiplyScalar(
    PLANET_RADIUS + height + SURFACE_CLEARANCE,
  );
  const alignToSurface = new THREE.Quaternion().setFromUnitVectors(
    START_UP,
    placement.direction,
  );
  const yaw = new THREE.Quaternion().setFromAxisAngle(
    placement.direction,
    placement.yaw,
  );

  return {
    position: surfacePoint,
    rotation: yaw.multiply(alignToSurface),
  };
}

function heightForPlacement(placement: SceneryPlacement) {
  if (placement.asset === "/scale-test-assets/tree.glb") {
    return 509.086 * placement.scale;
  }
  if (placement.asset === "/scale-test-assets/pine-tree.glb") {
    return 2.586 * placement.scale;
  }
  if (placement.asset === "/scale-test-assets/bush.glb") {
    return 0.172 * placement.scale;
  }
  return 0.375 * placement.scale;
}

function collisionForPlacement(placement: SceneryPlacement) {
  const transform = transformForPlacement(placement);
  const surfaceNormal = placement.direction.clone().normalize();
  const height = heightForPlacement(placement);

  if (placement.asset === "/scale-test-assets/pine-tree.glb") {
    return [
      {
        kind: "capsule",
        base: transform.position.clone(),
        up: surfaceNormal,
        radius: 0.45,
        height: height * 0.42,
      },
      {
        kind: "sphere",
        base: transform.position.clone().addScaledVector(surfaceNormal, height * 0.7),
        up: surfaceNormal,
        radius: 2.8,
      },
    ] satisfies FlightCollisionObstacle[];
  }

  if (placement.asset === "/scale-test-assets/tree.glb") {
    return [
      {
        kind: "capsule",
        base: transform.position.clone(),
        up: surfaceNormal,
        radius: 0.4,
        height: height * 0.55,
      },
      {
        kind: "sphere",
        base: transform.position.clone().addScaledVector(surfaceNormal, height * 0.72),
        up: surfaceNormal,
        radius: 3.4,
      },
    ] satisfies FlightCollisionObstacle[];
  }

  return [
    {
      kind: "sphere",
      base: transform.position.clone().addScaledVector(surfaceNormal, height * 0.5),
      up: surfaceNormal,
      radius: placement.asset === "/scale-test-assets/bush.glb" ? 1.9 : 2.1,
    },
  ] satisfies FlightCollisionObstacle[];
}

function SceneryAsset({ placement }: { placement: SceneryPlacement }) {
  const { scene } = useGLTF(placement.asset);
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

  const transform = useMemo(() => transformForPlacement(placement), [placement]);

  return (
    <group position={transform.position} quaternion={transform.rotation}>
      <group scale={[placement.scale, placement.scale, placement.scale]}>
        <primitive object={object} position={anchorOffset} />
      </group>
    </group>
  );
}

export function ProceduralScenery({
  viewerPosition,
  onObjectCount,
  onCollisionObstacles,
}: ProceduralSceneryProps) {
  const placements = useMemo(
    () => buildPlacements(viewerPosition),
    [viewerPosition],
  );

  useEffect(() => {
    onObjectCount?.(placements.length);
  }, [onObjectCount, placements.length]);

  useEffect(() => {
    onCollisionObstacles?.(placements.flatMap(collisionForPlacement));
  }, [onCollisionObstacles, placements]);

  return (
    <group>
      {placements.map((placement, index) => (
        <SceneryAsset
          key={`${placement.asset}-${index}-${placement.direction.x.toFixed(5)}-${placement.direction.z.toFixed(5)}`}
          placement={placement}
        />
      ))}
    </group>
  );
}

useGLTF.preload("/scale-test-assets/tree.glb");
useGLTF.preload("/scale-test-assets/pine-tree.glb");
useGLTF.preload("/scale-test-assets/small-rock.glb");
useGLTF.preload("/scale-test-assets/bush.glb");
