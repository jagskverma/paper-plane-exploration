import { useMemo } from "react";
import * as THREE from "three";
import { PLANET_RADIUS, TERRAIN_HEIGHT_AMPLITUDE } from "../core/worldConfig";
import { evaluateTerrainHeight } from "../procedural/TerrainHeight";
import { CUBE_SPHERE_RESOLUTION } from "./CubeSphereSurface";

function terrainColor(height: number) {
  const h = THREE.MathUtils.clamp(
    height / TERRAIN_HEIGHT_AMPLITUDE * 0.5 + 0.5,
    0,
    1,
  );

  if (h < 0.3) {
    return new THREE.Color("#1a4a8a").lerp(new THREE.Color("#3a7a4a"), h / 0.3);
  }
  if (h < 0.55) {
    return new THREE.Color("#3a7a4a").lerp(
      new THREE.Color("#8a9a5a"),
      (h - 0.3) / 0.25,
    );
  }
  if (h < 0.8) {
    return new THREE.Color("#8a9a5a").lerp(
      new THREE.Color("#aaaa8a"),
      (h - 0.55) / 0.25,
    );
  }
  return new THREE.Color("#aaaa8a").lerp(
    new THREE.Color("#ffffff"),
    (h - 0.8) / 0.2,
  );
}

function buildFaceGeometry(axis: "x" | "y" | "z", sign: number, res: number) {
  const verts: number[] = [];
  const colors: number[] = [];
  const idx: number[] = [];
  const stride = res + 1;

  for (let i = 0; i <= res; i++) {
    for (let j = 0; j <= res; j++) {
      const u = (i / res) * 2 - 1;
      const v = (j / res) * 2 - 1;

      let x: number, y: number, z: number;
      if (axis === "x") { x = sign; y = v; z = u; }
      else if (axis === "y") { x = u; y = sign; z = v; }
      else { x = u; y = v; z = sign; }

      const direction = new THREE.Vector3(x, y, z).normalize();
      const height = evaluateTerrainHeight(direction);
      const radius = PLANET_RADIUS + height;
      const color = terrainColor(height);

      verts.push(
        direction.x * radius,
        direction.y * radius,
        direction.z * radius,
      );
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      const a = i * stride + j;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

interface FaceDef {
  axis: "x" | "y" | "z";
  sign: number;
}

const FACES: FaceDef[] = [
  { axis: "x", sign: 1 },
  { axis: "x", sign: -1 },
  { axis: "y", sign: 1 },
  { axis: "y", sign: -1 },
  { axis: "z", sign: 1 },
  { axis: "z", sign: -1 },
];

export function CubeSpherePlanet() {
  const geometries = useMemo(() => {
    const res = CUBE_SPHERE_RESOLUTION;
    return FACES.map((f) => buildFaceGeometry(f.axis, f.sign, res));
  }, []);

  return (
    <group>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            vertexColors
            roughness={0.85}
            metalness={0}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
