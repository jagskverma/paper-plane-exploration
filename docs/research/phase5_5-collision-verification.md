# Phase 5.5 — Collision Verification Report

> Generated: 2026-05-29

## How Collision Works

`FlightController.resolveObstacleCollisions()`:

1. Defines plane collision radius: `planeRadius = 0.8`
2. Iterates all obstacles set via `setCollisionObstacles()`
3. For each obstacle, finds the closest collision point:
   - sphere obstacles use their center
   - capsule obstacles use the closest point on their terrain-normal-aligned segment
4. If `distance < obstacle.radius + planeRadius`:
   - Pushes plane position away along offset direction to exactly `minDistance`
   - Removes the current heading component into the obstacle
   - Applies a short collision cooldown
   - Holds speed at `MIN_SPEED` during that cooldown

Obstacle centers come from `getScaleTestCollisionObstacles()` in `ScaleTestPlacements.ts`:
- Tree obstacles are split into narrow trunk capsules plus canopy spheres.
- Bushes and rocks use small sphere obstacles.

## Per-Object Analysis

| Object | Collision Shape | Intent |
|--------|-----------------|--------|
| Pine tree | narrow trunk capsule + canopy sphere | Allows under-canopy flight gaps while blocking visible trunk/canopy mass |
| Broad tree | narrow trunk capsule + canopy sphere | Allows under-canopy flight gaps while blocking visible trunk/canopy mass |
| Bush | small sphere | Blocks only near visible bush volume |
| Small rock | small sphere | Blocks only near visible rock volume |

## Findings

1. **Trees DO block the plane.** With collision heights of 13-15m and flight altitude of 12m AGL, pine and broad trees extend above the flight path.
2. **Bushes and rocks do NOT block.** Their collision heights (2.5-3m) are well below 12m AGL.
3. **Collision response is a hard push + temporary blocker.** The plane is pushed outward, speed is held at minimum briefly, and heading into the obstacle is removed so the plane cannot simply creep through after resistance.
4. **Tree collision is multi-part.** A single tall capsule blocked under-canopy space too aggressively. Trees now use narrow trunk capsules and canopy spheres, closer to the visible asset shape.

## Bug Found

The collision obstacle center calculation in `getScaleTestCollisionObstacles()` mutates the transform position:

```ts
center: transform.position.addScaledVector(
    surfaceNormal,
    placement.collisionHeight * 0.5,
),
```

This modifies `transform.position` in-place, which means subsequent calls to `scaleTestPlacementTransform()` for the SAME placement would get an already-offset position. This is a subtle shared-state bug. The fix is to clone before mutating.

## Follow-Up Fix

After playtesting, the old response was found to create resistance but still allow the plane to creep through the obstacle. `FlightController` now removes heading into the obstacle and applies a short collision cooldown. This is still a coarse Phase 5.5 placeholder, not a final collision system.

After further playtesting, spherical tree obstacles were also found to miss visible canopies near the top of the tree. Collision obstacles were changed to terrain-normal-aligned capsule/segment blockers. A later pass found that single tall capsules blocked under-canopy flight too aggressively, so tree collision now uses narrow trunk capsules plus canopy spheres.

## Recommendation

Collision is now adequate for Phase 5.5 tree fly-through testing. Bushes and rocks remain low obstacles that the plane can pass over at normal 12m AGL cruise, which is acceptable unless the design goal changes to make them hazards.
