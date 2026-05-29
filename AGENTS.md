# AGENTS.md — Paper Plane Exploration

> Auto-loaded by AI coding tools. Violating these = rejected PR.

## Project Identity

Atmospheric lowpoly paper plane exploration game. Browser-first. Three.js + React Three Fiber + TypeScript + Vite.

The goal is emotional — a feeling of drifting through a vast beautiful world. NOT a tech demo, NOT a sim, NOT a systems-heavy game.

## Current Phase: 5.5 — Paper Plane Scale & Ground-Proximity Feel

Phases 1-5 are implemented. Current work is a corrective feel/scale phase before terrain streaming: make the moment-to-moment experience feel like a real paper plane flying low through a low-poly world. Do not implement Phase 7 terrain streaming until Phase 5.5 is playtested and Phase 6 research/ADR review is accepted.

## Non-Negotiable Rules

### FORBIDDEN (reject on sight)

- ECS (Entity Component System)
- Plugin systems
- Dependency injection frameworks
- Event buses
- Speculative abstractions
- Premature generalization
- Hidden global mutable state
- Deep inheritance hierarchies
- Enterprise architecture patterns
- New dependencies without explicit justification
- Hardcoded biome data, keyboard bindings, or magic numbers
- Terrain generation in the render loop
- Shader duplication
- Tight coupling between: rendering, flight, terrain, UI, audio, input

### REQUIRED (reject if missing)

- Every task follows `docs/TASK_TEMPLATE.md` format
- Code is understandable by inspection — no hidden behavior
- Concrete solutions before generalizations
- Subsystems communicate through explicit interfaces
- All code has architectural reasoning in PR description
- Nothing merges without human review

### PRIORITY (do NOT invert this order)

1. Movement feel
2. Atmosphere
3. Traversal pleasure
4. Scale illusion
5. Terrain systems
6. Biome variety
7. Content expansion
8. Optimization
9. Polish

## Subsystem Boundaries

| Subsystem | Owns | Does NOT touch |
|-----------|------|----------------|
| `src/core/` | Bootstrap, lifecycle, config | — |
| `src/rendering/` | Scene, camera, materials, shaders, postprocessing | Gameplay, terrain gen |
| `src/flight/` | Plane movement, physics, camera feel | Terrain, rendering internals, biomes |
| `src/terrain/` | Cube-sphere gen, chunk streaming, LOD | Flight, UI, audio |
| `src/procedural/` | Noise, biome masking, gen rules | Rendering |
| `src/shaders/` | GLSL modules, shared uniforms | — |
| `src/ui/` | HUD, menus, overlays | — |
| `src/audio/` | Spatial audio, ambient, music | — |
| `src/input/` | Action-based input abstraction | — |

Communicate through explicit interfaces. Never through shared mutable state.

## Architecture Decisions

- **Planet topology:** Cube sphere (not UV sphere, not flat terrain). See `docs/decisions/001-cube-sphere-topology.md`
- **Rendering:** Three.js + R3F. No re-evaluating frameworks.
- **Build:** Vite + pnpm. No npm, no webpack.
- **Language:** TypeScript. Strict mode.
- **Platform:** PC browser first. Mobile-aware but not mobile-first.

## Performance Stance

Do NOT optimize early. Prioritize clarity and feel. Optimization comes in Phase 16, not before. Awareness of draw calls / memory / WebGL limits is fine — acting on them prematurely is not.

## Full Docs

| Doc | When to read |
|-----|-------------|
| `docs/VISION.md` | Unclear on emotional target |
| `docs/ARCHITECTURE.md` | Architecture questions |
| `docs/RULES.md` | Full constraint list |
| `docs/ROADMAP.md` | What phase are we in, what's next |
| `docs/TASK_TEMPLATE.md` | Before ANY implementation task |
| `docs/PROJECT_STATE.md` | Current status |
| `docs/references/ASSET_LIBRARY.md` | Available local assets |
| `docs/decisions/` | Why we chose X over Y |
| `docs/REVIEW_CHECKLIST.md` | Pre-merge review gates |
