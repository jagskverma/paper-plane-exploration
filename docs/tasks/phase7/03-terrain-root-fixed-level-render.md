# Objective

Implement `apps/web/src/terrain/TerrainRoot.tsx` — an R3F component that renders terrain chunks at a fixed level for all six cube faces.

# Why

Before dynamic chunk selection or caching, we need a simple render target that proves terrain chunks can be generated and displayed using the same height function and geometry layout as the current monolithic planet.

# Constraints

- Code only in `apps/web/src/terrain/TerrainRoot.tsx`.
- Must use `TerrainGenerator` from Task 02.
- Do NOT remove or disable `CubeSpherePlanet` yet. This component renders alongside it or behind a feature flag.
- Do not implement chunk selection. Render ALL chunks at a fixed level.
- Do not implement caching yet. Generate geometries on mount via `useMemo`.
- Do not import from `flight/`, `rendering/`, `world/`, `input/`, or `ui/`.
- Keep rendering simple: one `<mesh>` per chunk with `meshStandardMaterial` and `vertexColors`.

# Existing Context

- `apps/web/src/terrain/ChunkId.ts` — chunk identity
- `apps/web/src/terrain/TerrainGenerator.ts` — chunk geometry generation (to be implemented in Task 02)
- `apps/web/src/world/CubeSpherePlanet.tsx` — current monolithic renderer (keep intact)
- `apps/web/src/core/worldConfig.ts` — PLANET_RADIUS

# Deliverables

- `apps/web/src/terrain/TerrainRoot.tsx`
- Renders chunks at a single fixed level (suggested: level 2 = 16 chunks per face, 96 total).
- Uses `meshStandardMaterial` with `vertexColors`, `roughness=0.85`, `flatShading`.
- Does not require a viewer position prop yet.

# Acceptance Criteria

- [ ] `pnpm lint` and `pnpm build` pass from `apps/web`.
- [ ] Component renders without runtime errors when added to the scene (even if behind a flag).
- [ ] Chunks cover all 6 cube faces.
- [ ] No visible gaps between adjacent same-face chunks.
- [ ] No imports from `world/`, `flight/`, or `rendering/`.

# Non-Goals

- No viewer-based chunk selection.
- No cache.
- No geometry disposal.
- No replacement of `CubeSpherePlanet` yet.
- No frustum culling.

# Technical Notes

Use `useMemo` to generate all chunk geometries on mount. Level 2 means 2²=4 chunks per axis = 16 per face, 96 total. Each chunk is 16×16 cells = 289 vertices. Total: ~27,744 vertices. This fits comfortably in browser memory and renders fast.
