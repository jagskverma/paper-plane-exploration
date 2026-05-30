import type { ChunkId, CubeFace } from "./ChunkId";
import { chunksPerAxis } from "./ChunkId";

const FACES: CubeFace[] = [0, 1, 2, 3, 4, 5];
const NEAR_LEVEL = 4;

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

export function selectChunks(): ChunkId[] {
  return chunksAtLevel(NEAR_LEVEL);
}
