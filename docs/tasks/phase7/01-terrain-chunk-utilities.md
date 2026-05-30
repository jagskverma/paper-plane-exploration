# Objective

Integrate existing pure terrain utilities (`ChunkId.ts`, `CubeSphereMapping.ts`) into the project build and verify they compile without runtime wiring.

# Why

Task 01 of the Phase 7 prep handoff already created `apps/web/src/terrain/ChunkId.ts`, `apps/web/src/terrain/CubeSphereMapping.ts`, and `apps/web/src/terrain/README.md`. This task confirms those files pass build and lint, and that no other subsystem has accidentally imported them yet.

# Constraints

- Do not change the utility files unless there is a build/lint error.
- Do not wire these utilities into `FlightScene`, `CubeSpherePlanet`, or any runtime component.
- Do not add imports from `terrain/` into `core/`, `flight/`, `world/`, or `rendering/`.
- Do not add test frameworks or external dependencies.

# Existing Context

- `apps/web/src/terrain/ChunkId.ts` — chunk identity, keys, validation, parent/child, UV bounds
- `apps/web/src/terrain/CubeSphereMapping.ts` — face UV ↔ sphere direction, grid point mapping
- `apps/web/src/terrain/README.md` — subsystem documentation
- `docs/decisions/002-terrain-streaming-architecture.md` — ADR-002 (proposed)

# Deliverables

- Verify `pnpm lint` and `pnpm build` pass from `apps/web`.
- No code changes if utilities are already correct.
- If the handoff did not create these files, create them now following the exact API in `docs/agent-handoff/hermes-phase7-prep/01-terrain-pure-utilities.md`.

# Acceptance Criteria

- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] `grep -r "from.*terrain" apps/web/src/core apps/web/src/flight apps/web/src/world apps/web/src/rendering` returns empty (no cross-subsystem imports into terrain)
- [ ] `ChunkId.ts` exports: `chunkKey`, `parseChunkKey`, `chunksPerAxis`, `validateChunkId`, `chunkUvBounds`, `parentChunk`, `childChunks`, `sameChunk`
- [ ] `CubeSphereMapping.ts` exports: `faceUvToCubePoint`, `faceUvToDirection`, `directionToFaceUv`, `chunkGridPointToDirection`

# Non-Goals

- No terrain rendering
- No chunk generation
- No integration with flight or world systems

# Technical Notes

These utilities already exist. This task is verification-only. See `apps/web/src/terrain/README.md` for subsystem boundaries.
