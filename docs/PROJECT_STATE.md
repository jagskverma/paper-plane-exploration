# Project State

> Last updated: 2026-05-29

## Current Phase

**Phase 5.5 — Paper Plane Scale & Ground-Proximity Feel** ← current

## Repo

- **Local:** `~/projects/paper-plane-exploration`
- **Remote:** https://github.com/jagskverma/paper-plane-exploration
- Issues: enabled | Projects: enabled | Wiki: disabled | Visibility: public

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
- [ ] Replace placeholder scenery choices with curated asset manifest

## Phase 8+ (future)
