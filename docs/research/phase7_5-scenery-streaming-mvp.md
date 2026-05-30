# Phase 7.5 — Scenery Streaming MVP

> Date: 2026-05-30

## Goal

Replace temporary procedural scatter with a bounded scenery streaming lifecycle.

## Plan Change

The roadmap now includes Phase 7.5 between terrain streaming and terrain stability/content expansion.

This change is necessary because the asset library is large and the browser cannot load or render planet-wide scenery. More asset categories should not be added until scenery instances stream by chunk with explicit budgets.

## Implementation

- Added `apps/web/src/world/SceneryGenerator.ts`.
- Added `apps/web/src/world/SceneryStreamer.tsx`.
- Replaced `ProceduralScenery` usage in `FlightScene` with `SceneryStreamer`.
- Deleted the temporary `ProceduralScenery.tsx` component.
- Added HUD metrics:
  - active scenery chunks
  - visible scenery objects
  - nearby scenery collision candidates
  - active asset types

## Runtime Budgets

- Active scenery chunks: 48 max
- Placements per chunk: 6
- Visible object budget: 220
- Collision radius: 240m
- Active asset set: starter woodland catalog only

## Verification

Observed browser HUD after reload:

- `scenery chunks: 34`
- `scenery: 160`
- `scenery collision: 4`
- `asset types: 9`
- `AGL: 12.0m`

No missing asset errors were observed. The only browser warning remains the existing Three.js clock deprecation.

## Tuning Update

Initial playtest showed pine trees were undersized and side/back scenery unloaded too aggressively during turns.

Changes applied:

- Increased tree scale ranges in `SceneryCatalog.ts`.
- Shifted starter woodland weights toward trees and away from small ground detail.
- Expanded the scenery angular window and backward retention allowance.
- Increased active scenery chunk and visible object budgets.

Observed browser HUD after retuning:

- `scenery chunks: 48`
- `scenery: 220`
- `scenery collision: 7`
- `asset types: 9`
- `AGL: 12.0m`

## Turn-Buffer Update

The first streamer selection was still too forward-biased: nearby side/back objects could disappear as soon as the player turned away, then reappear when turning back.

Changes applied:

- Split active scenery selection into a forward set and a nearby radial turn-buffer set.
- Kept scenery bounded while preserving nearby chunks through normal turns.
- Reduced placements per chunk from 6 to 5 so the stream covers more chunks at similar object counts.

Observed browser HUD after this change:

- `scenery chunks: 38`
- `scenery: 190`
- `scenery collision: 3`
- `asset types: 9`
- `AGL: 12.0m`

## Current Limits

- The terrain renderer is still single-level because mixed LOD caused visible slits.
- GLB binary cache eviction is not implemented; `useGLTF` still caches loaded asset types.
- The streamer mounts/unmounts object instances, not asset binaries.
- Chunk selection is forward-biased but not a precise camera frustum test.
- Collision candidates are approximate simple shapes.

## Test Controls

- Space triggers a temporary speed boost while `ENABLE_TEST_SPEED_BOOST` is true.
- A tap produces a short boost pulse for browser/playtest convenience.
- Holding Space keeps boost active.
- Verification observed speed rising from `9.0m/s` to `14.1m/s`, then decaying back toward cruise.

## Next Step

Playtest low-altitude turning and forward flight to tune:

- active chunk angle
- visible object budget
- collision radius
- placement density
- visible popping at streaming boundaries

Do not add landmarks or settlements until the woodland streaming window feels stable.
