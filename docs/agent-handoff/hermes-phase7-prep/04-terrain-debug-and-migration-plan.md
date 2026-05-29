# Objective

Write a migration and debug plan for replacing the monolithic cube-sphere planet with chunked terrain safely.

# Why

Terrain streaming can break the playable prototype quickly. A conservative migration plan gives Codex a checklist for swapping systems without losing current Phase 5.5 feel.

# Constraints

- Documentation only.
- Do not change code.
- Do not create implementation task files; Task 03 handles that.
- Do not propose new dependencies.
- Keep the plan browser-first and Vite-friendly.

# Existing Context

- `apps/web/src/core/FlightScene.tsx`
- `apps/web/src/world/CubeSpherePlanet.tsx`
- `apps/web/src/world/CubeSphereSurface.ts`
- `apps/web/src/world/ScaleTestObjects.tsx`
- `apps/web/src/world/ScaleTestPlacements.ts`
- `apps/web/src/ui/DebugHud.tsx`
- Current placeholder assets are anchored to the rendered cube-sphere surface.

# Deliverables

Create:

- `docs/research/phase7-terrain-migration-debug-plan.md`

# Required Content

Include these sections:

1. `Migration Principle`
2. `Feature Flag Strategy`
3. `What Must Continue Working`
4. `Debug Metrics`
5. `Visual Comparison Procedure`
6. `Asset Placement Compatibility`
7. `Flight Safety Compatibility`
8. `Rollback Procedure`
9. `Phase 7 Stop Conditions`

# Required Details

The plan must state:

- Initial chunked terrain must be optional behind one simple local flag/constant.
- `CubeSpherePlanet` must remain available until chunked terrain visually matches it at coarse level.
- Existing scale-test assets depend on rendered terrain surface anchoring and may need a shared terrain surface query after replacement.
- Flight currently samples `evaluateTerrainHeight`, not rendered chunk mesh. Any mismatch must be documented.
- Debug metrics should include:
  - visible chunk count
  - generated chunk count
  - cache size
  - approximate vertex count
  - geometry generation time if easy to measure
- Rollback should be one-line or one-constant.

# Acceptance Criteria

- Document gives a step-by-step migration path.
- Document identifies what can break in current Phase 5.5 behavior.
- Document is specific enough to use during implementation review.

# Non-Goals

- No implementation.
- No benchmark harness.
- No worker strategy.
- No final performance targets.
