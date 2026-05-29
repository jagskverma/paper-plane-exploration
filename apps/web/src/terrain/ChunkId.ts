/**
 * Chunk identity for per-face quadtree terrain streaming.
 *
 * Each chunk is uniquely identified by its cube face, quadtree level,
 * and grid position on that face. At level L, each face has 2^L x 2^L chunks.
 *
 * Key format: `f{face}:l{level}:x{x}:y{y}`
 */

export type CubeFace = 0 | 1 | 2 | 3 | 4 | 5;

export interface ChunkId {
  face: CubeFace;
  level: number;
  x: number;
  y: number;
}

/** Deterministic string key for a chunk. */
export function chunkKey(id: ChunkId): string {
  validateChunkId(id);
  return `f${id.face}:l${id.level}:x${id.x}:y${id.y}`;
}

/** Parse a chunk key string back into a ChunkId. Throws on invalid input. */
export function parseChunkKey(key: string): ChunkId {
  const m = key.match(/^f(\d):l(\d+):x(\d+):y(\d+)$/);
  if (!m) throw new Error(`Invalid chunk key: "${key}"`);
  const face = parseInt(m[1]) as CubeFace;
  const level = parseInt(m[2]);
  const x = parseInt(m[3]);
  const y = parseInt(m[4]);
  const id: ChunkId = { face, level, x, y };
  if (!validateChunkId(id)) throw new Error(`Invalid chunk key values: "${key}"`);
  return id;
}

/** Number of chunks per axis at a given level. Throws on invalid level. */
export function chunksPerAxis(level: number): number {
  if (!Number.isInteger(level) || level < 0) {
    throw new Error(`Invalid level: ${level}`);
  }
  return 1 << level;
}

/** Validate a ChunkId. Returns false if any field is out of range. */
export function validateChunkId(id: ChunkId): boolean {
  if (!Number.isInteger(id.face) || id.face < 0 || id.face > 5) return false;
  if (!Number.isInteger(id.level) || id.level < 0) return false;
  const perAxis = 1 << id.level;
  if (!Number.isInteger(id.x) || id.x < 0 || id.x >= perAxis) return false;
  if (!Number.isInteger(id.y) || id.y < 0 || id.y >= perAxis) return false;
  return true;
}

/** Normalized UV bounds [0,1] for a chunk on its face. */
export function chunkUvBounds(id: ChunkId): { u0: number; v0: number; u1: number; v1: number } {
  validateChunkId(id);
  const tiles = 1 << id.level;
  return {
    u0: id.x / tiles,
    v0: id.y / tiles,
    u1: (id.x + 1) / tiles,
    v1: (id.y + 1) / tiles,
  };
}

/** Parent chunk at one level coarser. Returns null at level 0. */
export function parentChunk(id: ChunkId): ChunkId | null {
  validateChunkId(id);
  if (id.level === 0) return null;
  return {
    face: id.face,
    level: id.level - 1,
    x: Math.floor(id.x / 2),
    y: Math.floor(id.y / 2),
  };
}

/**
 * Four child chunks at one level finer.
 * Order: NW (lower x, lower y), NE (higher x, lower y),
 *        SW (lower x, higher y), SE (higher x, higher y).
 */
export function childChunks(id: ChunkId): ChunkId[] {
  validateChunkId(id);
  const bx = id.x * 2;
  const by = id.y * 2;
  const level = id.level + 1;
  return [
    { face: id.face, level, x: bx, y: by },       // NW
    { face: id.face, level, x: bx + 1, y: by },   // NE
    { face: id.face, level, x: bx, y: by + 1 },   // SW
    { face: id.face, level, x: bx + 1, y: by + 1 }, // SE
  ];
}

/** Equality check for two ChunkIds. */
export function sameChunk(a: ChunkId, b: ChunkId): boolean {
  return a.face === b.face && a.level === b.level && a.x === b.x && a.y === b.y;
}
