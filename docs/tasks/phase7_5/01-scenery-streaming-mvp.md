# Objective
Implement a bounded scenery streaming MVP that mounts deterministic object instances only around and ahead of the paper plane.

# Why
The project has a large local asset library, but browser runtime must not load or render planet-wide scenery. Scenery needs chunk-based generation, visible-object budgets, and near-field collision filtering before adding landmarks, settlements, or more asset categories.

# Constraints
- Keep the game runnable at all times.
- Do not add dependencies.
- Do not introduce ECS, plugin systems, event buses, or generalized content frameworks.
- Do not scan the full asset library in the browser.
- Do not implement biome logic, landmarks, or settlements in this task.
- Do not reintroduce mixed terrain LOD.
- Keep rendering, flight, terrain, and scenery communication explicit.

# Existing Context
- Terrain chunks are represented by `apps/web/src/terrain/ChunkId.ts`.
- Single-level terrain currently comes from `selectChunks()` in `apps/web/src/terrain/TerrainQuadtree.ts`.
- Starter woodland assets are listed in `apps/web/src/world/SceneryCatalog.ts`.
- Current procedural scenery is in `apps/web/src/world/ProceduralScenery.tsx`.
- Flight collision obstacles are consumed by `FlightController.setCollisionObstacles`.
- Debug metrics are surfaced through `apps/web/src/core/terrainMetricsRef.ts` and `apps/web/src/ui/DebugHud.tsx`.

# Deliverables
- Pure deterministic chunk placement generation for scenery.
- React scenery streamer component that selects active chunks near/ahead of the plane.
- Hard budgets for active chunks, visible objects, and collidable objects.
- Near-only collision obstacle generation.
- Debug HUD metrics for active scenery chunks, rendered scenery objects, collidable scenery objects, and active asset types.
- Project state updated with the Phase 7.5 status.

# Acceptance Criteria
- Runtime HUD shows bounded scenery metrics.
- Visible scenery object count stays within the configured object budget.
- Collision object count is lower than visible scenery object count and limited to nearby objects.
- Flying forward changes the active scenery window without growing object counts unbounded.
- `pnpm lint` and `pnpm build` pass.

# Non-Goals
- Do not implement biome density rules.
- Do not add rare landmarks.
- Do not add settlements.
- Do not implement asset eviction from Drei/Three loader caches.
- Do not implement mesh-accurate collision.
- Do not implement worker-based generation.

# Technical Notes
- Use deterministic seeds based on `chunkKey(chunk)` and placement index.
- Reuse `evaluateTerrainHeight(direction)` for surface placement.
- Use `useGLTF` cache behavior for shared GLB asset data; this task streams mounted instances, not downloaded asset binaries.
- Bias chunk selection forward from the plane's current heading with enough side/back buffer to avoid visible popping during turns.
