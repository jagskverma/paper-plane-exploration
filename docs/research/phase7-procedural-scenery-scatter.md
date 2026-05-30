# Phase 7 — Procedural Scenery Scatter

> Date: 2026-05-30

## Goal

Add a visible scenery change on top of chunked terrain without starting a full biome or asset-spawning system.

## Implementation

- Added `apps/web/src/world/ProceduralScenery.tsx`.
- Scenery is generated deterministically from selected terrain chunks.
- Existing low-poly assets are reused:
  - pine trees
  - birch trees
  - maple trees
  - bushes
  - grass
  - rocks
- Placement uses chunk UV bounds and cube-sphere direction mapping.
- Surface height uses `evaluateTerrainHeight(direction)`.
- Object count is capped at 120.
- HUD reports `scenery: 120` when active.
- Procedural scenery now contributes collision volumes to the flight controller.
- Tree-like assets use narrow trunk capsules plus canopy spheres.
- Bushes and rocks use small sphere approximations.
- Legacy Phase 5.5 scale-test props are disabled while chunked terrain is active, so the active scene is driven by selected terrain chunks.
- Runtime asset selection uses `apps/web/src/world/SceneryCatalog.ts`, based on the curated starter woodland manifest in `docs/references/asset-curation/scenery-curation-manifest.json`.

## Current Limits

- Collision volumes are approximate, not mesh-accurate.
- Scenery placement uses deterministic chunk selection but not a full biome density model.
- Scenery is generated around the nearest level-4 chunks to the viewer.
- Asset bases use direction-based terrain height, not a triangle raycast against the exact rendered chunk mesh.

## Reasoning

This step makes chunked terrain visibly meaningful while keeping Phase 7 scoped. It proves that terrain chunks can drive deterministic world content and collision candidates, without adding a generalized spawn system or biome layer.

## Next Step

Tune woodland density and asset scale in playtest before adding rare landmarks or sparse settlement clusters.

The current runtime catalog intentionally uses only the starter woodland set. The manifest also contains landmark and settlement candidates, but those need separate placement rules so they do not appear as random clutter.
