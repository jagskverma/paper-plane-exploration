# Phase 5.5 — Collision Verification Report

> Generated: 2026-05-29

## How Collision Works

`FlightController.resolveObstacleCollisions()` (line 187-208):

1. Defines plane collision radius: `planeRadius = 0.8`
2. Iterates all obstacles set via `setCollisionObstacles()`
3. For each: `distance = |planePos - obstacle.center|`
4. If `distance < obstacle.radius + planeRadius`:
   - Pushes plane position away along offset direction to exactly `minDistance`
   - Reduces speed to `max(MIN_SPEED, speed * 0.45)` (~45% speed on hit)

Obstacle centers come from `getScaleTestCollisionObstacles()` in `ScaleTestPlacements.ts`:
- Each obstacle center = surface point + `surfaceNormal * collisionHeight * 0.5`
- Radius = `placement.collisionRadius`

## Per-Object Analysis

| Object | CollisionHeight | CollisionRadius | Sphere top (AGL) | Plane at 12m AGL |
|--------|----------------|-----------------|-------------------|-------------------|
| Pine tree (z=-50) | 15m | 4.5m | 15m AGL | **Will collide** (12m < 15m) |
| Broad tree (z=-68) | 13m | 5.5m | 13m AGL | **Will collide** (12m < 13m) |
| Bush (z=-88) | 2.5m | 3m | 2.5m AGL | Pass over (12m > 2.5m + 3m) |
| Small rock (z=-112) | 3m | 2m | 3m AGL | Pass over |
| Bush (z=-228) | 2.8m | 3.2m | 2.8m AGL | Pass over |
| All other trees | 13-15m | 3.5-5.5m | 13-15m AGL | **Will collide** |

## Findings

1. **Trees DO block the plane.** With collision heights of 13-15m and flight altitude of 12m AGL, pine and broad trees extend above the flight path.
2. **Bushes and rocks do NOT block.** Their collision heights (2.5-3m) are well below 12m AGL.
3. **Collision response is a hard push + speed drop.** The plane is pushed radially outward from the obstacle and speed drops to 45%. This feels like a "bump."
4. **No vertical obstacle check.** The collision is spherical (radial), not cylindrical. A plane at 12m AGL flying directly over a tree trunk at 0m AGL would still collide if within the horizontal radius, even though the trunk is below. Since trees have collisionRadius 3.5-5.5m and the sphere center is at 7.5m AGL (half of 15m), the sphere extends from 2m to 13m AGL — so horizontal approach at 12m will indeed collide.

## Bug Found

The collision obstacle center calculation in `getScaleTestCollisionObstacles()` mutates the transform position:

```ts
center: transform.position.addScaledVector(
    surfaceNormal,
    placement.collisionHeight * 0.5,
),
```

This modifies `transform.position` in-place, which means subsequent calls to `scaleTestPlacementTransform()` for the SAME placement would get an already-offset position. This is a subtle shared-state bug. The fix is to clone before mutating.

## Recommendation

Collision works correctly for trees. The system is adequate for Phase 5.5. Fix the shared-state mutation bug.
