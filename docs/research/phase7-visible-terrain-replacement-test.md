# Phase 7 — Visible Terrain Replacement Test

> Date: 2026-05-29

## Goal

Verify that the chunked terrain renderer can replace the monolithic `CubeSpherePlanet` behind the Phase 7 flag without breaking the playable Phase 5.5 scene.

## Test Setup

- `USE_CHUNKED_TERRAIN = true`
- Dev server: `http://127.0.0.1:5174/`
- Renderer path: `TerrainRoot`
- Chunk mode: fixed level 2
- Visible chunks: 96
- Generated chunks: 96
- Approximate vertices: 27,744

## Checks

| Check | Result | Notes |
|-------|--------|-------|
| App loads | Pass | No runtime errors observed |
| HUD terrain metrics appear | Pass | Shows `96 visible, 96 generated, 0 cached, 27744 verts` |
| Flight remains active | Pass | AGL and speed continue updating normally |
| Terrain covers visible surface | Pass | No missing face in the initial test view |
| Scale-test assets still render | Pass | Trees render in expected positions |
| Terrain lighting/color matches old planet | Fixed | Initial test exposed incorrect dark terrain caused by chunk index winding |

## Bug Found

The first replacement test showed dark, banded terrain. The issue was triangle winding in `TerrainGenerator.ts`.

The generator used:

```ts
indices.push(a, b, d, a, d, c);
```

Given the generator's row-major vertex order, that did not match the current cube-sphere face orientation. Normals were wrong for the visible top surface, causing incorrect lighting.

## Fix Applied

`TerrainGenerator.ts` now uses:

```ts
indices.push(a, c, d, a, d, b);
```

`docs/research/phase7-terrain-generator-spec.md` was updated to match.

## Current Status

Chunked terrain is enabled and usable for the next Phase 7 step.

## Dynamic Selection Follow-Up

`TerrainRoot` now receives a throttled viewer position from `FlightScene`, calls `selectChunks(viewerPosition)`, and reuses geometry through `TerrainCache`.

Initial verification:

- Visible chunks: 120
- Generated chunks on first selection: 120
- Cache entries: 120
- Approximate vertices: 34,680

The selector starts from level-2 coverage and refines the chunk containing the viewer down to level 4. This avoids overlapping parent/child chunks by replacing a parent with all four children whenever it subdivides.

## Remaining Risks

- Dynamic selection is still conservative and only performs a minimal local refinement.
- Asset placement still queries the old rendered cube-sphere helper, not the terrain subsystem.
- Seam behavior across dynamic LOD has not been tested.

## Recommendation

Proceed to wiring viewer-position chunk selection and `TerrainCache` into `TerrainRoot`. Keep the feature flag until:

- chunk selection is stable,
- cache disposal is verified,
- asset placement uses a shared terrain surface query compatible with chunked terrain,
- and no visible face seams appear during normal flight.
