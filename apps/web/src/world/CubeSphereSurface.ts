import * as THREE from "three";
import { PLANET_RADIUS } from "../core/worldConfig";
import { evaluateTerrainHeight } from "../procedural/TerrainHeight";

export const CUBE_SPHERE_RESOLUTION = 48;

type FaceAxis = "x" | "y" | "z";

interface FaceUv {
  axis: FaceAxis;
  sign: number;
  u: number;
  v: number;
}

function faceUvFromDirection(direction: THREE.Vector3): FaceUv {
  const ax = Math.abs(direction.x);
  const ay = Math.abs(direction.y);
  const az = Math.abs(direction.z);

  if (ax >= ay && ax >= az) {
    const sign = Math.sign(direction.x) || 1;
    return {
      axis: "x",
      sign,
      u: direction.z / ax,
      v: direction.y / ax,
    };
  }

  if (ay >= ax && ay >= az) {
    const sign = Math.sign(direction.y) || 1;
    return {
      axis: "y",
      sign,
      u: direction.x / ay,
      v: direction.z / ay,
    };
  }

  const sign = Math.sign(direction.z) || 1;
  return {
    axis: "z",
    sign,
    u: direction.x / az,
    v: direction.y / az,
  };
}

function cubeSphereVertex(axis: FaceAxis, sign: number, u: number, v: number) {
  let x: number;
  let y: number;
  let z: number;

  if (axis === "x") {
    x = sign;
    y = v;
    z = u;
  } else if (axis === "y") {
    x = u;
    y = sign;
    z = v;
  } else {
    x = u;
    y = v;
    z = sign;
  }

  const direction = new THREE.Vector3(x, y, z).normalize();
  const radius = PLANET_RADIUS + evaluateTerrainHeight(direction);
  return direction.multiplyScalar(radius);
}

function rayTriangleDistance(
  direction: THREE.Vector3,
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3,
) {
  const edge1 = b.clone().sub(a);
  const edge2 = c.clone().sub(a);
  const h = direction.clone().cross(edge2);
  const determinant = edge1.dot(h);

  if (Math.abs(determinant) < 0.000001) return null;

  const inverseDeterminant = 1 / determinant;
  const s = a.clone().negate();
  const u = inverseDeterminant * s.dot(h);
  if (u < 0 || u > 1) return null;

  const q = s.clone().cross(edge1);
  const v = inverseDeterminant * direction.dot(q);
  if (v < 0 || u + v > 1) return null;

  const t = inverseDeterminant * edge2.dot(q);
  return t > 0 ? t : null;
}

function triangleNormal(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
  const normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
  return normal.dot(a) < 0 ? normal.negate() : normal;
}

export function evaluateRenderedCubeSphereSurface(direction: THREE.Vector3) {
  const normalizedDirection = direction.clone().normalize();
  const face = faceUvFromDirection(normalizedDirection);
  const resolution = CUBE_SPHERE_RESOLUTION;
  const step = 2 / resolution;

  const clampedU = THREE.MathUtils.clamp(face.u, -1, 1);
  const clampedV = THREE.MathUtils.clamp(face.v, -1, 1);
  const i = Math.min(Math.floor((clampedU + 1) / step), resolution - 1);
  const j = Math.min(Math.floor((clampedV + 1) / step), resolution - 1);

  const u0 = -1 + i * step;
  const v0 = -1 + j * step;
  const u1 = u0 + step;
  const v1 = v0 + step;
  const fu = (clampedU - u0) / step;
  const fv = (clampedV - v0) / step;

  const a = cubeSphereVertex(face.axis, face.sign, u0, v0);
  const b = cubeSphereVertex(face.axis, face.sign, u0, v1);
  const c = cubeSphereVertex(face.axis, face.sign, u1, v0);
  const d = cubeSphereVertex(face.axis, face.sign, u1, v1);

  const triangle = fv >= fu
    ? [a, b, d] as const
    : [a, d, c] as const;
  const distance = rayTriangleDistance(
    normalizedDirection,
    triangle[0],
    triangle[1],
    triangle[2],
  );

  if (distance === null) {
    const point = normalizedDirection.multiplyScalar(
      PLANET_RADIUS + evaluateTerrainHeight(normalizedDirection),
    );
    return {
      point,
      normal: point.clone().normalize(),
    };
  }

  return {
    point: normalizedDirection.multiplyScalar(distance),
    normal: triangleNormal(triangle[0], triangle[1], triangle[2]),
  };
}
