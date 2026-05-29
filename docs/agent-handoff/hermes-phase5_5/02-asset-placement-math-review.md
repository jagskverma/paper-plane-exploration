# Objective

Review the mesh-anchored placement logic for scale-test assets and identify why objects may appear floating or buried.

# Why

Asset placement has had repeated visual issues. We need a precise explanation of the coordinate math before further tuning.

# Constraints

- Prefer analysis over code changes.
- If patching, keep it limited to placement math.
- Do not alter terrain generation visuals unless required by a proven bug.
- Do not change asset scales unless documenting why.
- Use `pnpm` only.

# Existing Context

- `apps/web/src/world/CubeSphereSurface.ts`
- `apps/web/src/world/CubeSpherePlanet.tsx`
- `apps/web/src/world/ScaleTestPlacements.ts`
- `apps/web/src/world/ScaleTestObjects.tsx`
- `apps/web/src/procedural/TerrainHeight.ts`

# Deliverables

- Add `docs/research/phase5_5-asset-placement-review.md`.
- Explain coordinate frames:
  - radial planet normal
  - rendered terrain triangle normal
  - object local Y/up
  - asset bounding-box base
- Identify any mismatch between rendered terrain and placement surface.
- Recommend the exact next change, if any.

# Acceptance Criteria

- The report names specific files and functions.
- It states whether `evaluateRenderedCubeSphereSurface` matches `CubeSpherePlanet`.
- It states whether bounding-box anchoring is correct for all selected GLBs.
- It explains whether floating/buried artifacts come from terrain sampling, object bounds, scale, normal alignment, camera perspective, or another cause.
- If code changed, `pnpm lint` and `pnpm build` pass from `apps/web`.

# Non-Goals

- No new asset system.
- No procedural spawning.
- No broad refactor.
- No collision work unless it directly exposes placement math bugs.

# Technical Notes

- `CubeSpherePlanet` renders a 48x48 cube-sphere face mesh.
- Placement should match the rendered mesh, not only the continuous terrain height function.
- Some GLBs have unusual pivots, origins, or bounds.
