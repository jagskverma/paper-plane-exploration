import * as THREE from "three";
import { PLANET_RADIUS, TERRAIN_HEIGHT_AMPLITUDE } from "../core/worldConfig";
import { evaluateTerrainHeight } from "../procedural/TerrainHeight";
import type { ChunkId } from "./ChunkId";
import { chunkUvBounds } from "./ChunkId";
import { chunkGridPointToDirection } from "./CubeSphereMapping";

const CHUNK_RESOLUTION = 16;

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

export function generateChunkGeometry(id: ChunkId): THREE.BufferGeometry {
  const { u0, v0, u1, v1 } = chunkUvBounds(id);
  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const stride = CHUNK_RESOLUTION + 1;

  for (let gridY = 0; gridY <= CHUNK_RESOLUTION; gridY += 1) {
    for (let gridX = 0; gridX <= CHUNK_RESOLUTION; gridX += 1) {
      const direction = chunkGridPointToDirection(
        id.face,
        u0,
        v0,
        u1,
        v1,
        gridX,
        gridY,
        CHUNK_RESOLUTION,
      );
      const height = evaluateTerrainHeight(direction);
      const radius = PLANET_RADIUS + height;
      const color = terrainColor(height);

      vertices.push(
        direction.x * radius,
        direction.y * radius,
        direction.z * radius,
      );
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let gridY = 0; gridY < CHUNK_RESOLUTION; gridY += 1) {
    for (let gridX = 0; gridX < CHUNK_RESOLUTION; gridX += 1) {
      const a = gridY * stride + gridX;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      indices.push(a, c, d, a, d, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
