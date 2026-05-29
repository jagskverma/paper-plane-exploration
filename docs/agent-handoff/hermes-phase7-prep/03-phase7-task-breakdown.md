# Objective

Create concrete Phase 7 implementation task files using the project task-template format.

# Why

Phase 7 is risky. We need small, reviewable implementation slices instead of one broad “build terrain streaming” task.

# Constraints

- Documentation only.
- Do not change code.
- Every task must follow `docs/TASK_TEMPLATE.md`.
- Keep each task small enough for one focused implementation pass.
- Do not mark tasks as completed.
- Do not change roadmap status.

# Existing Context

- `docs/TASK_TEMPLATE.md`
- `docs/ROADMAP.md`
- `docs/PROJECT_STATE.md`
- `docs/research/phase6-terrain-architecture.md`
- `docs/decisions/002-terrain-streaming-architecture.md`
- If Task 02 has been completed, use `docs/research/phase7-terrain-generator-spec.md`.

# Deliverables

Create directory:

- `docs/tasks/phase7/`

Create these files:

- `01-terrain-chunk-utilities.md`
- `02-terrain-generator-fixed-chunks.md`
- `03-terrain-root-fixed-level-render.md`
- `04-viewer-position-chunk-selection.md`
- `05-chunk-cache-and-disposal.md`
- `06-replace-monolithic-planet-behind-flag.md`
- `07-terrain-debug-readout.md`

# Required Task Scope

Each task file must include all sections from `docs/TASK_TEMPLATE.md`:

- Objective
- Why
- Constraints
- Existing Context
- Deliverables
- Acceptance Criteria
- Non-Goals
- Technical Notes

# Required Content Per Task

`01-terrain-chunk-utilities.md`
- Should reference Task 01 handoff output.
- Should be complete if utilities already exist.
- Acceptance should include `pnpm lint` and `pnpm build`.

`02-terrain-generator-fixed-chunks.md`
- Implement `apps/web/src/terrain/TerrainGenerator.ts`.
- Generate one chunk geometry from a `ChunkId`.
- No rendering.
- No cache.

`03-terrain-root-fixed-level-render.md`
- Implement `TerrainRoot.tsx`.
- Render fixed-level chunks only.
- Do not remove `CubeSpherePlanet` yet unless behind a flag.

`04-viewer-position-chunk-selection.md`
- Implement deterministic chunk selection from viewer position.
- Terrain must receive viewer position as prop; it must not import flight.

`05-chunk-cache-and-disposal.md`
- Add geometry cache keyed by `chunkKey`.
- Dispose evicted geometries.
- Keep cache simple.

`06-replace-monolithic-planet-behind-flag.md`
- Add a local feature flag or constant to switch from `CubeSpherePlanet` to `TerrainRoot`.
- Must preserve easy rollback.

`07-terrain-debug-readout.md`
- Add visible/debug readout for visible chunks, generated chunks, and approximate vertices.
- Keep UI minimal.

# Acceptance Criteria

- All files exist.
- Each task is specific and implementation-ready.
- No code changes.
- No scope creep into Phase 8+.

# Non-Goals

- Do not implement the tasks.
- Do not add issue tracker integrations.
- Do not alter `docs/ROADMAP.md`.
