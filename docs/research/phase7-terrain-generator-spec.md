# Phase 7 — Terrain Generator Implementation Spec

> Generated: 2026-05-29  
> Status: ready for implementation  
> Target file: `apps/web/src/terrain/TerrainGenerator.ts`

## 1. Goal

Generate a single `THREE.BufferGeometry` for one terrain chunk, identified by `ChunkId`, using the deterministic height function. No caching, no rendering, no chunk selection — just geometry from ID.

## 2. Inputs

| Input | Source | Type |
|-------|--------|------|
| `id: ChunkId` | Caller | `{ face, level, x, y }` |
| `resolution: number` | Constant | `16` (hardcoded for Phase 7) |

## 3. Outputs

A single `THREE.BufferGeometry` with:

- `position` attribute: `Float32BufferAttribute`, 3 components
- `color` attribute: `Float32BufferAttribute`, 3 components
- Index buffer: `Uint16Array` or `Uint32Array` (16×16 fits in Uint16)
- Computed vertex normals via `geometry.computeVertexNormals()`

## 4. Geometry Layout

- Cells per side: `resolution` (16)
- Vertices per side: `resolution + 1` (17)
- Total vertices: `(resolution + 1)²` (289)
- Total triangles: `resolution² × 2` (512)

## 5. Vertex Ordering

Row-major, outer loop over gridY (0 to resolution), inner loop over gridX (0 to resolution):

```
for gridY in 0..resolution:
  for gridX in 0..resolution:
    vertex[gridY * (resolution+1) + gridX] = ...
```

## 6. Index Ordering

Two triangles per cell, counter-clockwise winding:

```
for gridY in 0..resolution-1:
  for gridX in 0..resolution-1:
    a = gridY * stride + gridX
    b = a + 1
    c = a + stride
    d = c + 1
    indices.push(a, c, d)  // triangle 1
    indices.push(a, d, b)  // triangle 2
```

Where `stride = resolution + 1`.

## 7. Height Sampling

For each grid point `(gridX, gridY)`:

1. Get chunk UV bounds: `chunkUvBounds(id)` → `{ u0, v0, u1, v1 }`
2. Map grid point to sphere direction: `chunkGridPointToDirection(face, u0, v0, u1, v1, gridX, gridY, resolution)`
3. Normalize the direction (already done by `chunkGridPointToDirection`)
4. Sample height: `evaluateTerrainHeight(direction)` from `src/procedural/TerrainHeight`
5. Compute radius: `PLANET_RADIUS + height` from `src/core/worldConfig`
6. Vertex position: `direction * radius`

This uses normalized sphere direction for height, ensuring identical height values at shared edges across adjacent faces.

## 8. Color Bands

Use the same color logic as `CubeSpherePlanet.tsx` (function `terrainColor`):

- Normalize height: `h = clamp(height / TERRAIN_HEIGHT_AMPLITUDE * 0.5 + 0.5, 0, 1)`
- Deep blue (0.0–0.3): `#1a4a8a` → `#3a7a4a`
- Green (0.3–0.55): `#3a7a4a` → `#8a9a5a`
- Olive (0.55–0.8): `#8a9a5a` → `#aaaa8a`
- White peaks (0.8–1.0): `#aaaa8a` → `#ffffff`

Do not invent new biome colors. Use this exact palette for Phase 7.

## 9. Normal Generation

After setting positions and colors, call:

```ts
geometry.computeVertexNormals();
```

No custom normal calculation is needed for Phase 7. Shared edges will produce consistent normals because shared vertices have identical positions.

## 10. Chunk Boundary Rules

- **Same-face, same-level adjacency:** Shared edge vertices generate identical positions because the grid point math is deterministic. No special handling needed.

- **Cross-face adjacency:** Edges between different faces use the same `evaluateTerrainHeight(direction)` with normalized sphere direction, so heights agree even though face UVs differ.

- **LOD differences (Phase 8+):** Phase 7 does not require crack stitching. Visible seams at LOD boundaries are expected and acceptable. Phase 8 will handle skirts, stitching, or morph zones.

## 11. Initial Resolution

Hardcoded `16` cells per chunk side. This is small enough for fast synchronous generation yet produces visible terrain detail. Higher resolutions belong in Phase 8+.

## 12. Geometry Disposal

When a chunk is evicted from cache (Phase 7 task 05):

```ts
geometry.dispose();
```

`TerrainGenerator` itself does not dispose — it only creates. The cache layer owns disposal.

## 13. Known Phase 7 Limitations

- No LOD crack stitching — visible seams at level transitions
- No smooth morphing between LOD levels
- Synchronous generation on main thread — may cause micro-stutter with many chunks
- Fixed resolution per chunk — no adaptive detail
- Single face material — no biome or material variety

All of these are deferred to Phase 8+.

## 14. Acceptance Criteria for Implementation

- [ ] `TerrainGenerator.ts` exports a single function: `generateChunkGeometry(id: ChunkId): THREE.BufferGeometry`
- [ ] Function is synchronous and returns a valid `BufferGeometry`
- [ ] Geometry has `position`, `color`, and index attributes
- [ ] `computeVertexNormals()` is called
- [ ] `pnpm build` passes
- [ ] Can call from a console test: `generateChunkGeometry({face: 2, level: 0, x: 0, y: 0})` returns a geometry
- [ ] No imports from `world/`, `core/`, or `flight/` (only `terrain/`, `procedural/`, `core/worldConfig`, and `three`)
