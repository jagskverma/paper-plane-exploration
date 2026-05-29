# Objective
Define the terrain architecture for cube-sphere chunk streaming before Phase 7 implementation.

# Why
Terrain streaming is the highest-risk system in the current roadmap. A small architecture pass now reduces the chance of building an unstable chunk system, while keeping the game runnable and avoiding premature terrain complexity.

# Constraints
- Keep the cube-sphere topology from ADR-001.
- Keep terrain ownership inside `apps/web/src/terrain/` once implementation begins.
- Do not move flight, input, UI, or rendering logic into terrain.
- Do not generate terrain inside the render loop.
- Do not add dependencies for Phase 6.
- Do not introduce ECS, event buses, plugin systems, dependency injection, or speculative engine layers.
- Keep the first implementation visually simple: geometry stability before biome variety.
- Preserve fast Vite iteration.

# Existing Context
- Current planet rendering is a single six-face cube sphere in `apps/web/src/world/CubeSpherePlanet.tsx`.
- Shared world constants live in `apps/web/src/core/worldConfig.ts`.
- Flight reads only planet-scale constants and stays surface-relative.
- ADR-001 selects cube-sphere topology for future chunk subdivision.
- Phase 7 is expected to implement a Terrain Streaming MVP, not a full terrain engine.

# Deliverables
- Research notes for chunk addressing, LOD, generation, seam handling, and memory strategy.
- Proposed ADR for the Phase 7 terrain streaming architecture.
- A small implementation sequence for Phase 7 tasks.

# Acceptance Criteria
- The terrain architecture explains how chunks are identified across all six cube faces.
- The plan defines how chunk lifecycle is driven without render-loop generation.
- The plan identifies seam and LOD risks before implementation.
- The plan keeps flight, procedural generation, terrain, rendering, and UI boundaries explicit.
- The plan lists concrete Phase 7 tasks small enough for separate implementation passes.

# Non-Goals
- Do NOT implement streaming terrain in Phase 6.
- Do NOT introduce biome generation.
- Do NOT add oceans, landmarks, weather, save systems, or gameplay objectives.
- Do NOT optimize for final performance yet.
- Do NOT replace the current visual planet until Phase 7 has an MVP path.

# Technical Notes

## Recommended Shape

Phase 7 should replace the current monolithic cube sphere with a small terrain subsystem composed of plain TypeScript data and React rendering components:

- `terrain/ChunkId.ts`: `face`, `level`, `x`, `y` identity and helpers.
- `terrain/CubeSphereMapping.ts`: face-local UV to sphere direction utilities.
- `terrain/TerrainChunk.ts`: chunk descriptor, bounds, resolution, and lifecycle state.
- `terrain/TerrainQuadtree.ts`: chooses visible chunk IDs from viewer position.
- `terrain/TerrainGenerator.ts`: builds geometry for one chunk outside the render loop.
- `terrain/TerrainRoot.tsx`: R3F component that renders the current chunk set.

Keep procedural height evaluation as a pure function. It can start simple and deterministic, then move to workers only after the synchronous MVP proves the chunk model.

## Chunk Identity

Use square chunks on each cube face:

```ts
interface ChunkId {
  face: 0 | 1 | 2 | 3 | 4 | 5;
  level: number;
  x: number;
  y: number;
}
```

At level `L`, each face has `2^L x 2^L` chunks. A chunk covers:

```ts
const tiles = 2 ** level;
const u0 = x / tiles;
const v0 = y / tiles;
const u1 = (x + 1) / tiles;
const v1 = (y + 1) / tiles;
```

Map `[0, 1]` face UV into `[-1, 1]`, project to the cube face, normalize to a sphere direction, then apply radius plus height.

## LOD Strategy

Start with distance bands from the viewer's surface point:

- Near: higher level, local detail around the plane.
- Mid: medium level, stable horizon silhouette.
- Far: low level, broad planet shape.

For Phase 7, use conservative fixed bands and hard swaps. Smooth morphing and crack stitching belong in Phase 8 after chunk identity and lifecycle are stable.

## Lifecycle

Terrain selection should happen from current flight state, but terrain must not import flight internals. The core scene can pass an explicit viewer position into `TerrainRoot`.

Recommended data flow:

```text
FlightController -> FlightScene -> TerrainRoot(viewerPosition)
TerrainRoot -> TerrainQuadtree -> ChunkId[]
TerrainRoot -> TerrainGenerator -> THREE.BufferGeometry
TerrainRoot -> mesh list
```

Generation should be cached by `ChunkId`. The render frame may decide which chunks are needed, but expensive geometry creation should happen in memoized updates or scheduled work, not directly inside `useFrame`.

## Seam Handling

Phase 7 should avoid solving every seam problem at once:

- Use the same deterministic height function for all faces based on normalized sphere direction, not face-local noise.
- Generate shared edge positions from exact face mapping math.
- Keep adjacent LOD differences limited to one level where possible.
- Accept visible LOD cracks in Phase 7 only if documented and bounded.

Phase 8 should handle stitching, skirts, or morph zones after the MVP shows real artifacts.

## Memory Strategy

Start with a small chunk budget and simple cache eviction:

- Keep visible chunks.
- Keep one ring of recently visible chunks.
- Dispose geometries when chunks leave the cache.
- Track chunk count and approximate vertex count in the debug HUD or console.

Do not build a general resource manager yet.

## Phase 7 Task Sequence

1. Implement cube-sphere mapping utilities with deterministic tests.
2. Implement `ChunkId` helpers and parent/child math.
3. Render one generated terrain chunk per face at a fixed level.
4. Add viewer-position based chunk selection.
5. Add chunk cache and disposal.
6. Replace the monolithic `CubeSpherePlanet` with `TerrainRoot` only after the chunk version visually matches the current planet at a coarse level.
7. Add minimal debug readout: visible chunks, generated chunks, approximate vertices.

## Main Risks

- Face-edge cracks from inconsistent mapping.
- LOD popping near the horizon.
- Geometry churn causing GC spikes.
- Terrain code reaching into flight state directly.
- Overbuilding async workers before the chunk model is proven.

The safest path is a boring synchronous MVP first, with clear seams and lifecycle behavior, then worker generation once the shape is known.
