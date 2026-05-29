# Objective

Add a feature flag that switches terrain rendering between the monolithic `CubeSpherePlanet` and the chunked `TerrainRoot`, preserving easy rollback.

# Why

Terrain streaming is risky. If chunked terrain breaks the playable prototype, we need instant rollback to the known-good monolithic renderer.

# Constraints

- Add a single boolean constant in `apps/web/src/core/worldConfig.ts`: `export const USE_CHUNKED_TERRAIN = false;`
- In `FlightScene.tsx`, conditionally render `CubeSpherePlanet` or `TerrainRoot` based on this flag.
- Do NOT remove `CubeSpherePlanet` or `CubeSphereSurface`.
- Do NOT change any existing rendering logic.
- When `USE_CHUNKED_TERRAIN = false`, the game must behave identically to current Phase 5.5.
- `pnpm lint` and `pnpm build` must pass with both flag values.

# Existing Context

- `apps/web/src/world/CubeSpherePlanet.tsx` — current monolithic renderer
- `apps/web/src/terrain/TerrainRoot.tsx` — chunked terrain renderer (Task 03)
- `apps/web/src/core/FlightScene.tsx` — renders the planet
- `apps/web/src/core/worldConfig.ts` — shared constants

# Deliverables

- Add `USE_CHUNKED_TERRAIN` constant to `worldConfig.ts` (default `false`).
- Add conditional rendering in `FlightScene.tsx`.
- Verify both flag values compile.

# Acceptance Criteria

- [x] `pnpm lint` and `pnpm build` pass.
- [x] With flag `false`: game renders identical to current Phase 5.5.
- [x] With flag `true`: `TerrainRoot` renders instead of `CubeSpherePlanet`.
- [x] Flipping the flag and rebuilding takes no other changes.
- [x] Rollback is one constant change.

# Non-Goals

- No runtime toggle (pure build-time flag).
- No transition animations.
- No config file or .env.
- No automatic flag selection.

# Technical Notes

The flag is a simple `export const`. Changing it requires a rebuild, which is intentional — this is a development feature flag, not a user-facing setting. Remove the flag entirely in Phase 8 once chunked terrain is proven stable.
