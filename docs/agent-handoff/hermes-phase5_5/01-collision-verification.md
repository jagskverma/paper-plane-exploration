# Objective

Verify whether current Phase 5.5 placeholder asset collisions actually prevent the plane from flying through trees, rocks, and bushes.

# Why

Collision was added quickly and needs independent validation before flight feel is tuned around it.

# Constraints

- Do not redesign the collision system.
- Do not add physics libraries.
- Do not change flight feel constants unless a bug is clearly identified.
- Keep code changes small and explain them.
- Use `pnpm` only.
- Preserve subsystem boundaries: flight may consume generic obstacle data, but should not know asset implementation details.

# Existing Context

- `apps/web/src/flight/FlightController.ts`
- `apps/web/src/world/ScaleTestPlacements.ts`
- `apps/web/src/world/ScaleTestObjects.tsx`
- `apps/web/src/world/CubeSphereSurface.ts`
- `apps/web/src/core/FlightScene.tsx`
- Current phase is Phase 5.5: paper-plane scale and ground-proximity feel.

# Deliverables

- Add `docs/research/phase5_5-collision-verification.md`.
- If there is an obvious collision bug, patch it.
- Include exact reproduction steps.
- Include screenshots if possible.

# Acceptance Criteria

- Report says whether each placeholder object type blocks the plane:
  - pine tree
  - broad tree
  - bush
  - rock
- Report identifies whether collision volumes match visuals closely enough for Phase 5.5.
- Report identifies whether the collision response feels like a temporary blocker, bounce, or sticky push.
- If code changed, `pnpm lint` and `pnpm build` pass from `apps/web`.

# Non-Goals

- No full collision engine.
- No terrain streaming.
- No gameplay damage/crash state.
- No particle effects, sound effects, or UI collision feedback.

# Technical Notes

- The current implementation uses coarse spherical obstacles via `FlightController.setCollisionObstacles`.
- If the plane still passes through assets, first verify whether obstacle centers/radii align with visual assets.
- Keep any fix Phase 5.5-specific unless a general interface is clearly already present.
