# Objective

Write a deterministic implementation specification for Phase 7 chunk geometry generation.

# Why

Terrain generation is the highest-risk next implementation step. Codex needs a precise spec for geometry layout, vertex ordering, height sampling, normals, colors, and disposal before replacing the monolithic planet.

# Constraints

- Documentation only.
- Do not change code.
- Do not add files under `apps/web/src/terrain/` for this task.
- Do not modify ADR-002 in this task.
- Do not propose new dependencies.
- Keep the spec compatible with the utility APIs from Task 01.

# Existing Context

- `docs/research/phase6-terrain-architecture.md`
- `docs/decisions/002-terrain-streaming-architecture.md`
- `apps/web/src/world/CubeSpherePlanet.tsx`
- `apps/web/src/procedural/TerrainHeight.ts`
- `apps/web/src/core/worldConfig.ts`

# Deliverables

Create:

- `docs/research/phase7-terrain-generator-spec.md`

# Required Content

The document must include these sections:

1. `Goal`
2. `Inputs`
3. `Outputs`
4. `Geometry Layout`
5. `Vertex Ordering`
6. `Index Ordering`
7. `Height Sampling`
8. `Color Bands`
9. `Normal Generation`
10. `Chunk Boundary Rules`
11. `Initial Resolution`
12. `Geometry Disposal`
13. `Known Phase 7 Limitations`
14. `Acceptance Criteria For Implementation`

# Deterministic Requirements

Specify these exact implementation choices:

- Initial chunk resolution: `16` cells per side.
- Vertices per chunk: `(resolution + 1) * (resolution + 1)`.
- Triangles per chunk: `resolution * resolution * 2`.
- Use `chunkUvBounds(id)` from `ChunkId.ts`.
- Use `chunkGridPointToDirection(...)` from `CubeSphereMapping.ts`.
- Apply radius as `PLANET_RADIUS + evaluateTerrainHeight(direction)`.
- Use normalized sphere direction for height sampling.
- Use the same color-band logic as current `CubeSpherePlanet` initially; do not invent biome colors.
- Use `BufferGeometry`.
- Use `Float32BufferAttribute` for `position` and `color`.
- Use index buffer for triangles.
- Call `computeVertexNormals()`.
- Dispose geometry with `geometry.dispose()` when evicted.

# Boundary Rules To Specify

The spec must explicitly state:

- Adjacent chunks at the same level must generate identical shared-edge positions if they share the same face and edge.
- Cross-face edges must use normalized direction based height, so height values agree even if face UVs differ.
- Phase 7 does not need perfect LOD crack stitching.
- Phase 8 owns skirts, stitching, or morph zones.

# Acceptance Criteria

- Document is specific enough that an agent can implement `TerrainGenerator.ts` without asking architecture questions.
- Document does not ask for features outside Phase 7 MVP.
- No code changes.

# Non-Goals

- No implementation.
- No LOD selector.
- No rendering component.
- No worker generation.
- No biome system.
