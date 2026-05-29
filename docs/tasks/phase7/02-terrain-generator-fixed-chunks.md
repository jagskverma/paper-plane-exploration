# Objective

Implement `apps/web/src/terrain/TerrainGenerator.ts` — a synchronous function that produces `THREE.BufferGeometry` for one terrain chunk from a `ChunkId`.

# Why

Terrain geometry generation is the core of Phase 7 streaming. A stable deterministic generator must exist before adding chunk selection, caching, or rendering.

# Constraints

- Code only in `apps/web/src/terrain/TerrainGenerator.ts`.
- No React. No R3F hooks.
- No caching — generate geometry fresh each call.
- No chunk selection — the caller provides a single `ChunkId`.
- Do not add dependencies.
- Do not import from `world/`, `core/`, `flight/`, or `rendering/`.
- Imports allowed: `three`, `src/terrain/*`, `src/procedural/TerrainHeight`, `src/core/worldConfig`.

# Existing Context

- Full spec: `docs/research/phase7-terrain-generator-spec.md`
- Chunk utilities: `apps/web/src/terrain/ChunkId.ts`, `CubeSphereMapping.ts`
- Height function: `apps/web/src/procedural/TerrainHeight.ts`
- World constants: `apps/web/src/core/worldConfig.ts`
- Reference implementation: `apps/web/src/world/CubeSpherePlanet.tsx` (same color bands, same height function)

# Deliverables

- `apps/web/src/terrain/TerrainGenerator.ts`
- Single export: `export function generateChunkGeometry(id: ChunkId): THREE.BufferGeometry`
- Adheres to the spec in `docs/research/phase7-terrain-generator-spec.md`.

# Acceptance Criteria

- [x] `pnpm lint` and `pnpm build` pass from `apps/web`.
- [x] `generateChunkGeometry({face: 2, level: 0, x: 0, y: 0})` returns a valid `BufferGeometry`.
- [x] Geometry has `position`, `color`, index, and computed normals.
- [x] 16×16 cells = 289 vertices, 512 triangles.
- [x] Height uses `evaluateTerrainHeight(direction)` with normalized sphere direction.
- [x] Colors match `CubeSpherePlanet` color bands.
- [x] Same resolution, same height function, same color logic as the current planet.

# Non-Goals

- No rendering.
- No cache.
- No LOD.
- No chunk selection.
- No seams or skirts.
- No worker generation.

# Technical Notes

Follow the spec exactly. The generator is called once per chunk by the cache layer; it should be fast and deterministic. Do not memoize inside the function — caching belongs in the cache layer (Task 05).
