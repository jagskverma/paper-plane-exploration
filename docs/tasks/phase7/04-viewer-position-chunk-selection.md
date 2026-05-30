# Objective

Implement `apps/web/src/terrain/TerrainQuadtree.ts` — a pure function that selects visible chunk IDs based on viewer position and distance bands.

# Why

Chunk streaming requires selecting which chunks to generate and render. A simple distance-band selector keeps the initial implementation understandable while proving the chunk model works with real flight positions.

# Constraints

- Code only in `apps/web/src/terrain/TerrainQuadtree.ts`.
- Pure function: no state, no async, no side effects.
- Must accept `viewerPosition: THREE.Vector3` as argument. Must NOT import flight state directly.
- Do not render. Only return `ChunkId[]`.
- Use the distance-band strategy from `docs/research/phase6-terrain-architecture.md`.

# Existing Context

- `apps/web/src/terrain/ChunkId.ts` — chunk identity, parent/child navigation
- `apps/web/src/terrain/CubeSphereMapping.ts` — directionToFaceUv
- `apps/web/src/core/worldConfig.ts` — PLANET_RADIUS
- `docs/research/phase6-terrain-architecture.md` — LOD distance bands

# Deliverables

- `apps/web/src/terrain/TerrainQuadtree.ts`
- Export: `export function selectChunks(viewerPosition: THREE.Vector3): ChunkId[]`
- Uses three distance bands:
  - Near (< 200m from viewer): level 4 (fine detail)
  - Mid (200–800m): level 3
  - Far (> 800m): level 2 (coarse)

# Acceptance Criteria

- [ ] `pnpm lint` and `pnpm build` pass.
- [ ] Function is pure and deterministic.
- [ ] Returns array of ChunkIds, no duplicates.
- [ ] All returned chunks are valid (pass `validateChunkId`).
- [ ] Covers all 6 faces with at least some chunks.
- [ ] Does not import from `flight/`.

# Non-Goals

- No frustum culling.
- No smooth LOD transitions.
- No chunk priority or streaming order.
- No rendering.

# Technical Notes

Start simple: for Phase 7, select ALL chunks at level 2 across all faces (16 per face, 96 total), plus near-viewer chunks at level 4. This is conservative and guarantees coverage. Optimize distance bands in Phase 8. The key metric is total chunk count — keep it under 200 for Phase 7.
