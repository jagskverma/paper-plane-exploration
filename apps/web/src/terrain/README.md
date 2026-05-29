# Terrain Subsystem

Pure TypeScript utilities and eventually chunked terrain rendering for the cube-sphere planet.

## Purpose

This folder owns terrain chunk identity, cube-sphere face mapping, geometry generation, chunk selection, caching, and terrain rendering. It replaces the monolithic `CubeSpherePlanet` in Phase 7 with per-face quadtree terrain chunks.

## Current State (Phase 7 prep)

The files here are **pure utilities only** — no rendering, no React components, no Three.js scene objects. They are not wired into the runtime yet.

- `ChunkId.ts` — chunk identity, keys, validation, UV bounds, parent/child navigation
- `CubeSphereMapping.ts` — face UV ↔ sphere direction conversion, grid point mapping

## What terrain owns (Phase 7+)

- Chunk identity and addressing
- Cube-sphere face-to-direction math
- Chunk geometry generation (`TerrainGenerator.ts`)
- Chunk selection from viewer position (`TerrainQuadtree.ts`)
- Geometry cache and disposal
- Terrain root rendering component (`TerrainRoot.tsx`)

## What terrain must NOT own

- Flight physics or state
- Camera orientation
- Input handling
- UI/HUD
- Audio
- Biome definitions (those go in `procedural/`)
- World configuration constants (those stay in `core/worldConfig.ts`)

## Face Numbering Convention

| Face | Axis | Sign |
|------|------|------|
| 0 | X | + |
| 1 | X | − |
| 2 | Y | + |
| 3 | Y | − |
| 4 | Z | + |
| 5 | Z | − |

UV coordinates are normalized `[0, 1]` on each face. Direction-based height sampling uses normalized sphere direction (not face-local UV), ensuring consistent heights across adjacent faces.

## When This Gets Wired In

These utilities will be used by Phase 7 implementation tasks (see `docs/tasks/phase7/`). The `CubeSpherePlanet` component in `src/world/` remains the active terrain renderer until replaced behind a feature flag.
