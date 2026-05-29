# Hermes Phase 7 Prep Handoff

These tasks prepare Phase 7 terrain streaming work without destabilizing the current Phase 5.5 playable prototype.

## Agent Instructions

- Work on one task at a time, in filename order.
- Read `AGENTS.md`, `docs/ROADMAP.md`, `docs/PROJECT_STATE.md`, `docs/research/phase6-terrain-architecture.md`, and `docs/decisions/002-terrain-streaming-architecture.md` before starting.
- Preserve the current playable scene. Do not replace `CubeSpherePlanet` or wire new terrain into `FlightScene` unless a task explicitly says to do so. None of these tasks ask for that.
- Keep new implementation code inside `apps/web/src/terrain/`.
- Do not add dependencies.
- Do not add a test framework.
- Do not implement worker generation.
- Do not implement biomes, assets, oceans, landmarks, or terrain collision.
- Do not modify flight feel constants.
- Do not touch `apps/web/src/flight/` unless a task explicitly says it is allowed. These tasks do not require it.
- After any code change, run from `apps/web`:
  - `pnpm lint`
  - `pnpm build`
- If a task is documentation-only, do not change code.

## Expected Outcome

When these tasks are complete, Codex should be able to implement Phase 7 faster because:

- Terrain chunk identity and cube-sphere mapping utilities already exist as pure TypeScript.
- Geometry generation requirements are specified in enough detail to implement without re-litigating architecture.
- Phase 7 implementation tasks are written in the required task-template format.
- Risks, invariants, and migration steps are documented.

## Suggested Order

1. `01-terrain-pure-utilities.md`
2. `02-terrain-generator-spec.md`
3. `03-phase7-task-breakdown.md`
4. `04-terrain-debug-and-migration-plan.md`
5. `05-adr002-review-and-final-recommendation.md`
