# Objective

Add a simple geometry cache to `TerrainRoot` that reuses generated chunk geometries and disposes evicted ones.

# Why

Without caching, every render frame would regenerate all terrain geometry. A keyed cache keeps generation cost bounded and prevents memory leaks via explicit disposal.

# Constraints

- Code in `apps/web/src/terrain/` (new file: `TerrainCache.ts` or inline in `TerrainRoot.tsx`).
- Cache is a `Map<string, THREE.BufferGeometry>` keyed by `chunkKey(id)`.
- Maximum cache size: 256 entries.
- Eviction: when full, remove the oldest entry (FIFO). Call `geometry.dispose()` before removing.
- Do not use `useFrame` or `requestAnimationFrame` for cache management.

# Existing Context

- `apps/web/src/terrain/ChunkId.ts` — `chunkKey` function
- `apps/web/src/terrain/TerrainGenerator.ts` — `generateChunkGeometry`
- `apps/web/src/terrain/TerrainRoot.tsx` — renders chunks

# Deliverables

- `apps/web/src/terrain/TerrainCache.ts`
- Export: `export class TerrainCache` with:
  - `get(id: ChunkId): THREE.BufferGeometry | undefined`
  - `set(id: ChunkId, geometry: THREE.BufferGeometry): void`
  - `has(id: ChunkId): boolean`
  - `clear(): void`
  - `get size(): number`
- Caches geometries; evicts with `geometry.dispose()` when over capacity.

# Acceptance Criteria

- [x] `pnpm lint` and `pnpm build` pass.
- [x] Cache stores and retrieves geometries by chunkKey.
- [x] When cache exceeds 256 entries, oldest is evicted and disposed.
- [x] `clear()` disposes all geometries.
- [x] No imports from `flight/`, `rendering/`, `world/`.

# Non-Goals

- No LRU or sophisticated eviction policy.
- No automatic cache pruning from flight position.
- No worker-based generation.
- No memory reporting beyond debug metrics.

# Technical Notes

FIFO is fine for Phase 7. A simple array tracking insertion order alongside the Map keeps eviction O(1). The cache layer does NOT call `generateChunkGeometry` — the root component does that, then stores the result.
