# Phase 5.5 — Asset Placement Math Review

> Generated: 2026-05-29

## Coordinate Frames

### 1. Radial Planet Normal
The direction from planet center (0,0,0) to any surface point. `evaluateTerrainHeight(direction)` returns the height offset at that direction. Surface point = `direction * (PLANET_RADIUS + height)`.

### 2. Rendered Terrain Triangle Normal
`evaluateRenderedCubeSphereSurface` ray-traces against the actual triangle mesh, returning the exact hit point and the triangle's face normal. This accounts for interpolation between vertices.

### 3. Object Local Y/Up
Placed objects are rotated so their local Y aligns with the surface normal. The rotation uses `Quaternion.setFromUnitVectors(START_UP, surface.normal)`.

### 4. Asset Bounding-Box Base
GLB models have their origin at varying positions relative to their geometry:
- Some at bounding-box center (half-buried at 0.15m clearance)
- Some at bounding-box bottom (sits on surface)
- Some at arbitrary pivot points

## Matching Analysis

### Does `evaluateRenderedCubeSphereSurface` match `CubeSpherePlanet`?

**Yes.** Both use:
- Same resolution: `CUBE_SPHERE_RESOLUTION = 48`
- Same terrain function: `evaluateTerrainHeight(direction)`
- Same vertex formula: `direction * (PLANET_RADIUS + height)`

The `buildFaceGeometry` in `CubeSpherePlanet.tsx` (line 35-81) computes vertices identically to `cubeSphereVertex` in `CubeSphereSurface.ts` (line 50-72). The ray-traced surface will hit exactly the rendered triangles.

### Does placement match rendered terrain?

**Yes.** `scaleTestPlacementTransform` uses `evaluateRenderedCubeSphereSurface` which ray-traces the same triangle mesh. The 0.15m `SURFACE_CLEARANCE` ensures objects are just above the surface.

## Root Cause of Floating/Buried Artifacts

If objects appear floating or buried, the cause is:

1. **GLB origin position** — The most likely cause. `SURFACE_CLEARANCE` is only 0.15m. Models with center-origin will appear half-buried. Models with bottom-origin will sit on the surface. This varies per `.glb` file.

2. **Camera perspective** — At 12m AGL with a low chase camera, parallax can make objects appear offset from the surface.

3. **Not: terrain sampling mismatch.** The math is verified identical.

## Recommendation

If a specific asset appears floating/buried, the fix should be:
- Measure the GLB bounding box in Blender or via `new THREE.Box3().setFromObject(scene)`
- Add a per-asset vertical offset in `SURFACE_CLEARANCE` or in the scale test placement data
- Do NOT change the terrain height function or surface sampling — they are correct

No code change needed at this time. The math is sound.
