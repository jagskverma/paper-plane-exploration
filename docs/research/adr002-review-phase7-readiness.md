# ADR-002 Review — Phase 7 Readiness Assessment

> Generated: 2026-05-29

## 1. Is ADR-002 still compatible with current Phase 5.5 code?

**Yes.** ADR-002 describes a per-face quadtree chunk system that would replace the monolithic `CubeSpherePlanet`. The current code uses `evaluateTerrainHeight` which is already direction-based (not face-local), compatible with the cross-face height consistency requirement. The `ChunkId` and `CubeSphereMapping` pure utilities (Task 01) implement the chunk identity and mapping described in ADR-002. No conflicts exist.

## 2. Does ADR-002 define enough to start Phase 7 Task 01?

**Yes.** The ChunkId interface, face convention, and cube-sphere mapping concepts are specific enough. Task 01 has already been completed using ADR-002 as the reference architecture. The synchronous-first generation constraint and face-numbering convention were directly applied.

## 3. Does ADR-002 overreach into Phase 8+?

**No.** It explicitly defers:
- Worker generation
- Smooth LOD morphing
- Crack stitching or skirts
- Biomes and material variety
- Collision or terrain-following flight

The LOD strategy section mentions distance bands as a starting point, which is a Phase 7 concern. The section is appropriately scoped.

## 4. Are subsystem boundaries clear enough?

**Yes.** The recommended data flow is explicit:

```
FlightController → FlightScene → TerrainRoot(viewerPosition)
TerrainRoot → TerrainQuadtree → ChunkId[]
TerrainRoot → TerrainGenerator → THREE.BufferGeometry
```

Terrain does not import flight internals. The viewer position is passed as a prop. This boundary is clean and testable.

## 5. Is the synchronous-first generation decision still correct?

**Yes, and more so after Phase 5.5 experience.** The current monolithic planet generates synchronously and works without frame drops. A synchronous chunk generator at 16×16 resolution per chunk, limited to ~200 chunks, will perform similarly. Worker-based generation would add complexity before the chunk lifecycle is proven. The synchronous-first path is validated by the existing codebase.

## 6. What is the biggest implementation risk not fully addressed?

**Face-edge seams at LOD transitions.** ADR-002 acknowledges this risk but defers it to Phase 8. The migration plan (Task 04) adds a stop condition: if seam gaps are visible and cannot be fixed with a small patch, revert. This is acceptable for an MVP, but the first cross-face LOD test will likely expose artifacts. The recommendation: implement cross-face LOD at a single level (all chunks at level 2) before adding distance-band LOD. This eliminates cross-LOD seams entirely for the initial test.

## 7. Should ADR-002 status become `accepted`, remain `proposed`, or be amended first?

**Recommendation: ACCEPT as-is.**

ADR-002 is compatible with current code, specific enough for implementation, and does not overreach. The risk about LOD seams is documented and deferred. The only amendment worth considering is adding a recommendation to use a single LOD level for the initial cross-face test, but this is implementation guidance, not an architecture change.

## Recommended Action

Change ADR-002 status from `proposed` to `accepted` with a minor note about single-level-first testing for cross-face validation.

Proposed edit to `docs/decisions/002-terrain-streaming-architecture.md`:

```
-Status: proposed
+Status: accepted
```

Add to the LOD Strategy section:

```
+For the initial Phase 7 cross-face test, use a single level for all
+chunks before introducing distance-band LOD. This eliminates cross-LOD
+seam artifacts for the first validation pass.
```
