import { useEffect, useMemo } from "react";
import type * as THREE from "three";
import type { BufferGeometry } from "three";
import type { TerrainDebugMetrics } from "../core/terrainMetricsRef";
import type { ChunkId } from "./ChunkId";
import { chunkKey } from "./ChunkId";
import { TerrainCache } from "./TerrainCache";
import { generateChunkGeometry } from "./TerrainGenerator";
import { selectChunks } from "./TerrainQuadtree";

const VERTICES_PER_CHUNK = 17 * 17;

interface TerrainRootProps {
  viewerPosition: THREE.Vector3;
  onMetrics?: (metrics: TerrainDebugMetrics) => void;
}

interface RenderChunk {
  id: ChunkId;
  key: string;
  geometry: BufferGeometry;
}

interface TerrainSelection {
  chunks: RenderChunk[];
  metrics: TerrainDebugMetrics;
}

export function TerrainRoot({ viewerPosition: _viewerPosition, onMetrics }: TerrainRootProps) {
  const cache = useMemo(() => new TerrainCache(), []);

  const selection = useMemo<TerrainSelection>(() => {
    const ids = selectChunks();
    const result = ids.reduce<{
      chunks: RenderChunk[];
      generatedChunks: number;
    }>((accumulator, id) => {
      let geometry = cache.get(id);
      if (!geometry) {
        geometry = generateChunkGeometry(id);
        cache.set(id, geometry);
        accumulator.generatedChunks += 1;
      }
      accumulator.chunks.push({
        id,
        key: chunkKey(id),
        geometry,
      });
      return accumulator;
    }, { chunks: [], generatedChunks: 0 });

    return {
      chunks: result.chunks,
      metrics: {
        visibleChunks: result.chunks.length,
        generatedChunks: result.generatedChunks,
        cacheEntries: cache.size,
        approximateVertices: result.chunks.length * VERTICES_PER_CHUNK,
      },
    };
  }, [cache]);

  useEffect(() => {
    onMetrics?.(selection.metrics);
  }, [onMetrics, selection.metrics]);

  useEffect(() => {
    return () => {
      cache.clear();
    };
  }, [cache]);

  return (
    <group>
      {selection.chunks.map((chunk) => (
        <mesh key={chunk.key} geometry={chunk.geometry}>
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
