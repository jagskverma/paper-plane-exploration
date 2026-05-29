# Phase 7 — Terrain Migration & Debug Plan

> Generated: 2026-05-29

## 1. Migration Principle

Replace the monolithic `CubeSpherePlanet` with chunked terrain in **reversible, verifiable steps**. At every step, the game must remain playable with the known-good monolithic renderer available via a single flag flip.

## 2. Feature Flag Strategy

Add a single constant in `apps/web/src/core/worldConfig.ts`:

```ts
export const USE_CHUNKED_TERRAIN = false;
```

In `FlightScene.tsx`:

```tsx
{USE_CHUNKED_TERRAIN ? <TerrainRoot /> : <CubeSpherePlanet />}
```

Default is `false`. Set to `true` during development and testing. Rollback is one-line.

## 3. What Must Continue Working

Regardless of which terrain renderer is active:

| System | Dependency | Risk |
|--------|-----------|------|
| Flight (pitch, roll, speed, AGL) | Only reads `evaluateTerrainHeight` + `worldConfig` | **Low** — terrain renderer doesn't affect flight math |
| Camera | Follows plane position, uses surface normals | **Low** |
| Scale-test objects | Anchored via `evaluateRenderedCubeSphereSurface` | **Medium** — chunked terrain may have different triangle positions at the same direction |
| Atmosphere (sky, clouds, fog) | Independent of terrain | **None** |
| Debug HUD | Reads flight state | **None** |

## 4. Debug Metrics

Track during Phase 7 development (via console or HUD):

| Metric | Expected Range | Warning Threshold |
|--------|---------------|-------------------|
| Visible chunks | 96–150 | > 300 (selection bug) |
| Generated chunks | 96–200 | > 500 (cache leak) |
| Cache size | ≤ 256 | = 256 with no eviction (cache full) |
| Approximate vertices | 27K–60K | > 150K (LOD too fine) |
| Frame time | < 16ms | > 33ms (geometry churn) |

## 5. Visual Comparison Procedure

When `USE_CHUNKED_TERRAIN = true`, verify:

1. Flip flag, rebuild, load game
2. Compare terrain silhouette against memory of monolithic version
3. Check for visible cracks at face boundaries (especially +Y/−Y transitions)
4. Verify terrain colors match (same color bands)
5. Fly a full circle around the planet at ~12m AGL — no holes, no popping

If chunked terrain doesn't visually match, flip flag back to `false` and debug before proceeding.

## 6. Asset Placement Compatibility

Scale-test objects use `evaluateRenderedCubeSphereSurface` which ray-traces against the monolithic `CubeSpherePlanet` triangle mesh. After migration:

- **If chunked terrain generates the same vertex positions** at identical directions, objects will anchor correctly.
- **If vertex positions differ** (e.g., due to index ordering), objects may float or sink slightly.

Fix option: add a `getTerrainSurfaceAt(direction)` abstraction that both renderers implement. Defer this to Phase 8 unless objects visibly misplace.

## 7. Flight Safety Compatibility

Flight uses `evaluateTerrainHeight(normal)` — a pure function that does NOT depend on rendered geometry. The chunked terrain and monolithic planet use the same height function. Therefore:

- **AGL altitude will be identical** regardless of renderer.
- **Collision with terrain** uses the same height function.
- **No flight code changes needed.**

If chunked terrain causes flight issues, the bug is in the renderer, not the flight system. Flip the flag back.

## 8. Rollback Procedure

1. Set `USE_CHUNKED_TERRAIN = false` in `worldConfig.ts`
2. Rebuild: `pnpm build` from `apps/web`
3. Verify game renders with monolithic `CubeSpherePlanet`
4. If chunked code is broken, comment out imports to prevent tree-shaking issues (TypeScript will catch unused imports)

## 9. Phase 7 Stop Conditions

Stop Phase 7 and revert to monolithic if:

- **Seam gaps** are visible and cannot be fixed with a small patch.
- **Frame drops** below 30 FPS during normal flight.
- **Geometry churn** causes visible stutter every few seconds.
- **Cache overflows** despite expected chunk counts (< 200).
- **Scale objects** float or sink by more than 1m relative to monolithic.

Phase 7 is a technical validation phase. If the core chunk model doesn't work, fix it before adding LOD, biomes, or streaming optimizations.
