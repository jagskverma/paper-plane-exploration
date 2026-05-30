# Placement Taxonomy

> Generated: 2026-05-30  
> Target: Phase 7 procedural scenery placement

## 1. Purpose

These rules define how curated scenery assets should be placed procedurally on the cube-sphere terrain. They are concrete enough to implement in `ProceduralScenery.tsx` without additional design work.

## 2. Placement Roles

| Role | Assets | Behavior |
|------|--------|----------|
| `canopy_tree` | birch, maple, dead trees | Placed individually or in loose groves. No canopy overlap. |
| `pine_tree` | pine variants | Placed individually. Taller collision profile than canopy trees. |
| `bush` | bushes, flower bushes, grass | Ground cover. No collision. Grouped in clusters of 3-8. |
| `rock` | rocks, large rocks | Scattered on terrain. Occasional clusters of 2-5. |
| `landmark` | castle, lighthouse, gazebo, etc. | One per ~500m radius. Never cluster two landmarks. |
| `structure` | farmhouse, barn, shed, hut, house | Clusters of 2-5 buildings. One cluster per ~300m radius. |

## 3. Density Bands

| Band | Radius from viewer | Tree density (per 100m²) | Rock density | Bush density |
|------|-------------------|--------------------------|-------------|-------------|
| Near | 0–150m | 3–5 trees | 2–3 rocks | 5–10 bushes |
| Mid | 150–400m | 1–2 trees | 1–2 rocks | 3–5 bushes |
| Far | 400–800m | Coarse only (level 2 chunks) | Coarse only | Sparse |

Trees should be sparse enough to leave clear **flight corridors** — at least 15m gaps between trees at 12m AGL. No tree walls. No continuous canopies.

## 4. Altitude and Slope Rules

- **Flat/open ground (slope < 10°):** All tree types, rocks, bushes, structures.
- **Sloped terrain (10–25°):** Pine trees, rocks. No structures.
- **Steep terrain (> 25°):** Rocks only. Scattered, not dense.
- **Below sea level (future):** Water. No land assets.
- **Above 80% of max terrain height:** Rocks only. No trees at peaks.
- **Initial spawn path (±30m lateral, first 200m forward):** Sparse trees only. No structures or landmarks. The player's first moments should be open flight, not obstacle avoidance.

## 5. Collision Expectations (Phase 8+)

Phase 7 does not implement terrain-object collision beyond what exists in `FlightController`. When collision is added:

- **Tree:** Trunk capsule (radius 1m, from surface to canopy base) + canopy sphere (radius matching visual)
- **Rock/Bush:** Simple sphere approximating visual bounds
- **Structure:** Rough box or sphere. Fine-tune after visual placement is validated.
- **Landmark:** Sphere matching visual bounds + 2m margin
- **No-collision assets:** Grass, flower bushes (fly-through ok)

## 6. Starter Woodland Rules

```
trees:
  - common: pine-trees, birch-trees (40% each of tree placements)
  - uncommon: pine-trees-w8zaiyjk8c, maple-trees (10% each)
  - random dead tree ~5% of tree placements, placed near live trees

bushes:
  - common: grass, bushes, flower-bushes (equal distribution)
  - grouped in clusters of 3-8 within a 5m radius

rocks:
  - common: rock (80% of rock placements)
  - uncommon: rock-large (20%), placed on subtle terrain rises

placement order: trees first (grid-based jittered Poisson), then rocks (avoid tree overlap), then bushes (avoid both)
```

## 7. Sparse Settlement Rules

```
structures:
  - anchor building: farm-house or barn (one per cluster)
  - secondary: house, hut, storage-shed (1-3 per cluster)
  - max cluster size: 5 buildings
  - min distance between clusters: 300m

placement: on flat or gently sloped terrain, near woodland edge
avoid: steep terrain, mountain peaks, directly on spawn path
```

## 8. Landmark Rules

```
landmarks:
  - min distance between landmarks: 500m
  - max landmarks per face: 2
  - prefer visible horizon locations (hilltops, ridges, open plains)
  - castle/gazebo: open terrain, fly-around potential
  - lighthouse/watchtower: elevated terrain, visible silhouette
  - wind-turbine: open plains or gentle hills
  - never place two of the same landmark type within 1000m

landmark discovery: first landmark should be visible but not reachable
within 30 seconds of flight. Place ~400-600m from spawn point.
```

## 9. Phase 7 Non-Goals

- No biome system — all terrain uses woodland rules uniformly
- No seasonal or weather-based placement variation
- No save/restore of placed object state
- No dynamic LOD switching for placed objects
- No physics or destructible objects
- No pathfinding or NPC placement
- No day/night placement behavior differences
