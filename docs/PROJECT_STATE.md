# Project State

> Last updated: 2026-05-30

## Current Phase

**Phase 7.5 — Scenery Streaming MVP** ← current

## Repo

- **Local:** `~/projects/paper-plane-exploration`
- **Remote:** https://github.com/jagskverma/paper-plane-exploration
- Issues: enabled | Projects: enabled | Wiki: disabled | Visibility: public

## Working Agreement

- During feel-tuning and streaming work, obvious fixes should be implemented immediately instead of waiting for another explicit prompt.
- Document notable tuning decisions after implementation so the project state stays accurate.

---

## Phase 0 — Project Governance ✅

- [x] Vision, architecture, rules, roadmap, task templates
- [x] ADR system, review checklist, AGENTS.md
- [x] GitHub repo with Issues + Projects

## Phase 1 — Engine Foundation ✅

- [x] Vite + TypeScript + pnpm scaffold
- [x] Three.js + R3F + Drei integrated
- [x] TypeScript strict mode enabled
- [x] ESLint with `eslint-plugin-boundaries`
- [x] 12 subsystem folders

## Phase 2 — Flight Feel Prototype ✅

- [x] Arrow-key flight: roll, pitch, auto-forward
- [x] Procedural low-poly paper plane model for stable alignment and chase camera readability
- [x] Camera 5m behind, surface-up aligned

## Phase 3 — Atmospheric Rendering ✅

- [x] Blue sky dome (R=6000) with vertex-color gradient
- [x] Animated sun with warm/cool sky, light, and fog shifts
- [x] Volumetric cloud spheres at 3 altitudes
- [x] Floating dust particles (additive blending)
- [x] Exponential fog (0.00025 density)
- [x] Soft boundary at 150 units

## Phase 4 — Spherical Traversal Prototype ✅

- [x] Green sphere planet (R=4000)
- [x] Surface-relative flight: gravity toward center
- [x] Roll turns in the local tangent frame
- [x] Plane orientation aligns to surface normal while preserving bank and pitch
- [x] Lift = gravity at neutral pitch (stable cruise altitude)
- [x] Debug HUD (altitude/speed/bank/pitch/position)

## Phase 5 — Planet Topology & Coordinate Systems ✅

- [x] Cube-sphere planet (6 faces, 48×48 resolution, R=4000)
- [x] CPU-side deterministic terrain height shared by rendering and flight
- [x] Height-based color bands (deep blue → green → gray → white)
- [x] Diffuse lighting on terrain
- [x] Terrain amplitude: 70m (below 110m cruise altitude)
- [x] Flight altitude: 110m, min altitude: 35m
- [x] Flight altitude is measured above procedural terrain height
- [x] No clipping — plane safely above terrain peaks
- [x] Debug HUD shows altitude, distance, rotation, position
- [x] Researched `dgreenheck/threejs-procedural-planets` for patterns

## Phase 5.5 — Paper Plane Scale & Ground-Proximity Feel ← current

Purpose: correct the feel target before scaling terrain architecture. The game should feel like a real paper plane gliding close to terrain and environmental objects, not a small aircraft cruising high above a planet.

- [x] Lowered cruise altitude from 200m to 110m as an interim fix
- [x] Lowered terrain amplitude from 150m to 70m as an interim fix
- [x] Added CPU-side terrain height sampling for flight safety
- [x] Retuned world scale toward low-altitude paper-plane flight
- [x] Current cruise altitude: 12m AGL
- [x] Current terrain amplitude: 10m
- [x] Removed passive glide sink while scale testing so neutral flight does not automatically lose altitude
- [x] Added minimum AGL clamp and clear AGL debugging
- [x] Retuned camera for close, low, slow paper-plane traversal
- [x] Added a curated placeholder object strip for fly-through scale testing
- [x] Replaced problematic paper-plane GLB with procedural geometry
- [x] Mesh-anchored scale-test assets to the rendered cube-sphere terrain surface
- [x] Added coarse placeholder collision volumes for scale-test trees, bushes, and rocks
- [x] Retuned collision response so trees act as blockers, not just resistance
- [x] Changed placeholder collisions to multi-part simple shapes: narrow tree trunks, canopy spheres, and small prop spheres
- [ ] Playtest flying between terrain objects before terrain streaming

Available local asset library is documented in `docs/references/ASSET_LIBRARY.md`.

## Phase 6 — Terrain Architecture Research

- [x] Drafted terrain architecture research notes
- [x] Proposed per-face quadtree chunk architecture
- [x] Defined Phase 7 implementation sequence
- [x] ADR-002 reviewed and accepted
- [x] Phase 7 task sequence drafted

## Phase 7 — Terrain Streaming MVP (started, not wired into runtime)

- [x] Pure terrain chunk utilities added under `apps/web/src/terrain/`
- [x] Standalone fixed-resolution chunk geometry generator added
- [x] Fixed-level terrain render root added, not wired into runtime
- [x] Viewer-position chunk selection wired into `TerrainRoot`
- [x] Chunk geometry cache and disposal wired into `TerrainRoot`
- [x] Chunked terrain replacement enabled with `USE_CHUNKED_TERRAIN = true`
- [x] Terrain debug metrics path added for chunked terrain flag
- [x] Visible terrain replacement test completed; chunk index winding fixed
- [x] Initial dynamic selection verified: 120 visible chunks, 120 cached, 34,680 approximate vertices
- [x] Deterministic procedural scenery scatter added for nearby chunked terrain
- [x] Procedural scenery collision volumes merged into flight controller
- [x] Legacy Phase 5.5 scale-test props disabled while chunked terrain is active
- [x] First curated woodland asset slice copied to `apps/web/public/scenery-assets/`
- [x] Procedural scenery now uses a typed starter woodland catalog instead of scale-test assets
- [x] Replace placeholder scenery choices with curated starter woodland assets
- [x] Increased local procedural scenery density from 40 to 120 objects
- [x] Neutral flight no longer gains altitude from tangent integration on the curved planet
- [x] Phase 7 terrain temporarily switched to single-level chunks to remove mixed-LOD blue slits
- [ ] Replace single-level terrain with stitched LOD once edge stitching is implemented

## Phase 7.5 — Scenery Streaming MVP ← current

- [x] Roadmap updated to add Phase 7.5 before biome/content expansion
- [x] Scenery streaming task added under `docs/tasks/phase7_5/`
- [x] Pure deterministic scenery placement generator added
- [x] Runtime scenery streamer added with active chunk and visible object budgets
- [x] Scenery selection biased around/ahead of the paper plane
- [x] Scenery chunk groups mount/unmount from the active streaming window
- [x] Collision candidates limited to nearby scenery placements
- [x] HUD reports active scenery chunks, visible scenery objects, collision candidates, and active asset types
- [x] Runtime verified at 34 active scenery chunks, 160 visible scenery objects, 4 collision candidates, 9 active asset types
- [x] Increased tree scale and tree weighting after playtest showed undersized pine trees
- [x] Expanded scenery retention window to reduce visible pop-out while turning
- [x] Runtime verified at 48 active scenery chunks, 220 visible scenery objects, 7 collision candidates, 9 active asset types
- [x] Added a nearby turn-buffer chunk ring so side/back scenery persists better during turns
- [x] Runtime verified at 38 active scenery chunks, 190 visible scenery objects, 3 collision candidates, 9 active asset types
- [x] Added asset scale review mode at `/?scaleReview=1` with fixed camera and numbered starter woodland lineup
- [x] Applied first visual scale review feedback to starter woodland catalog
- [x] Added a visible `Scale Review Mode` banner for review URLs
- [x] Added test-only Space speed boost gated by `ENABLE_TEST_SPEED_BOOST`
- [x] Added explicit runtime scenery asset library plus `ACTIVE_SCENERY_ASSET_IDS` swap list
- [x] Switched active scenery to converted SimpleNature assets
- [x] Increased streamer density budget; runtime verified at 384 visible scenery objects and 13 active asset types
- [x] Integrated Hermes expanded asset database and OBB collision support
- [x] Fixed OBB collision cloning so `extents` and `boxRotation` survive `setCollisionObstacles`
- [x] Fixed OBB early-contact collision by using plane clearance only after clamping to the box surface
- [x] Bounded active runtime palette to 39 assets after 218 active assets delayed scene readiness
- [x] Runtime verified at 58 scenery chunks, 800 visible scenery objects, 9 collision candidates, 39 active asset types
- [ ] Playtest density and popping while turning at low altitude
- [ ] Add rare landmark and sparse settlement placement rules after woodland streaming feels right

## Phase 8+ (future)
