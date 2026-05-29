# Objective

Identify unused public assets and propose cleanup after the procedural plane replacement.

# Why

The paper plane GLB is no longer used by current code, but public assets may still include old files. We should avoid stale assets before the project grows.

# Constraints

- Do not delete files unless explicitly safe and documented.
- Prefer a report over cleanup.
- Do not touch selected scale-test assets.
- Use `rg` or equivalent search before declaring an asset unused.

# Existing Context

- `apps/web/public/paper-plane.glb`
- `apps/web/public/scale-test-assets/`
- `apps/web/src/flight/PlaneModel.tsx`
- `apps/web/src/world/ScaleTestObjects.tsx`
- `apps/web/src/world/ScaleTestPlacements.ts`

# Deliverables

- Add `docs/research/phase5_5-unused-assets.md`.
- Include a recommended cleanup list.

# Acceptance Criteria

- Report says whether `paper-plane.glb` is referenced anywhere.
- Report says which public assets are required by current code.
- Report distinguishes “safe to remove now” from “keep for comparison/reference.”
- If any code or assets are changed, `pnpm lint` and `pnpm build` pass from `apps/web`.

# Non-Goals

- No asset ingestion pipeline.
- No compression pass.
- No changes to the local downloaded asset library under `assets/`.
- No deleting scale-test assets currently referenced by code.
