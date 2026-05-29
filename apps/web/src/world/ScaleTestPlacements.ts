import * as THREE from "three";
import type { FlightCollisionObstacle } from "../flight/FlightController";
import { PLANET_RADIUS } from "../core/worldConfig";
import { evaluateRenderedCubeSphereSurface } from "./CubeSphereSurface";

export type ScaleTestAssetUrl =
  | "/scale-test-assets/tree.glb"
  | "/scale-test-assets/pine-tree.glb"
  | "/scale-test-assets/small-rock.glb"
  | "/scale-test-assets/bush.glb";

export interface ScaleTestPlacement {
  asset: ScaleTestAssetUrl;
  x: number;
  z: number;
  scale: number;
  yaw: number;
  collisionRadius: number;
  collisionHeight: number;
}

const START_UP = new THREE.Vector3(0, 1, 0);
const START_RIGHT = new THREE.Vector3(1, 0, 0);
const START_FORWARD = new THREE.Vector3(0, 0, -1);
const SURFACE_CLEARANCE = 0.15;

export const SCALE_TEST_PLACEMENTS: ScaleTestPlacement[] = [
  {
    asset: "/scale-test-assets/pine-tree.glb",
    x: -4,
    z: -50,
    scale: 8.0,
    yaw: 0.2,
    collisionRadius: 4.5,
    collisionHeight: 15,
  },
  {
    asset: "/scale-test-assets/tree.glb",
    x: 4,
    z: -68,
    scale: 0.04,
    yaw: 1.1,
    collisionRadius: 5.5,
    collisionHeight: 13,
  },
  {
    asset: "/scale-test-assets/bush.glb",
    x: -2.5,
    z: -88,
    scale: 26.0,
    yaw: 2.1,
    collisionRadius: 3,
    collisionHeight: 2.5,
  },
  {
    asset: "/scale-test-assets/small-rock.glb",
    x: 3,
    z: -112,
    scale: 13.0,
    yaw: 0.5,
    collisionRadius: 3,
    collisionHeight: 2.5,
  },
  {
    asset: "/scale-test-assets/pine-tree.glb",
    x: 4,
    z: -150,
    scale: 8.5,
    yaw: 2.8,
    collisionRadius: 4.8,
    collisionHeight: 16,
  },
  {
    asset: "/scale-test-assets/tree.glb",
    x: -4,
    z: -188,
    scale: 0.04,
    yaw: 1.7,
    collisionRadius: 5.5,
    collisionHeight: 13,
  },
  {
    asset: "/scale-test-assets/bush.glb",
    x: 2,
    z: -228,
    scale: 28.0,
    yaw: 0.9,
    collisionRadius: 3.2,
    collisionHeight: 2.8,
  },
];

export function scaleTestPlacementTransform(placement: ScaleTestPlacement) {
  const direction = START_UP.clone()
    .multiplyScalar(PLANET_RADIUS)
    .addScaledVector(START_RIGHT, placement.x)
    .addScaledVector(START_FORWARD, -placement.z)
    .normalize();
  const surface = evaluateRenderedCubeSphereSurface(direction);
  const position = surface.point.addScaledVector(surface.normal, SURFACE_CLEARANCE);
  const alignToSurface = new THREE.Quaternion().setFromUnitVectors(START_UP, surface.normal);
  const yaw = new THREE.Quaternion().setFromAxisAngle(surface.normal, placement.yaw);
  return {
    position,
    rotation: yaw.multiply(alignToSurface),
  };
}

export function getScaleTestCollisionObstacles(): FlightCollisionObstacle[] {
  return SCALE_TEST_PLACEMENTS.map((placement) => {
    const transform = scaleTestPlacementTransform(placement);
    const surfaceNormal = transform.position.clone().normalize();
    const center = transform.position.clone().addScaledVector(
      surfaceNormal,
      placement.collisionHeight * 0.5,
    );
    return {
      center,
      radius: placement.collisionRadius,
    };
  });
}
