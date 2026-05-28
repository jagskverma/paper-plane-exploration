# Architecture

## Rendering Stack

- **Three.js** — WebGL rendering engine
- **React Three Fiber** — React renderer for Three.js
- **TypeScript** — type-safe development
- **Vite** — build tooling and dev server

Browser-native, client-side only. No mandatory backend or server dependency.

## Repository Structure

```
paper-plane-exploration/
├── README.md
├── docs/                    # Project governance (this is Phase 0 material)
│   ├── VISION.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── ROADMAP.md
│   ├── TASK_TEMPLATE.md
│   ├── PROJECT_STATE.md
│   └── decisions/           # Architecture Decision Records
├── game/                    # Game source (Phase 1+)
│   ├── src/
│   ├── public/
│   └── package.json
├── agent-prompts/           # Curated agent task prompts (Phase 1+)
├── research/                # Experiments, spikes, reference material
└── benchmarks/              # Performance baselines (Phase 16+)
```

Directories are created as needed, not all at once.

## Platform Strategy

| Phase | Target |
|-------|--------|
| Initial | PC browser |
| Future | Mobile browser / packaged mobile |

PC-first development with mobile-aware architecture. Scalable, quality-adjustable rendering systems. No premature mobile optimization.

## Planet Topology

**Cube sphere** — NOT UV sphere, flat terrain, or traditional heightmap.

Reasons:
- Cleaner LOD subdivision
- Reduced pole distortion
- Better chunk streaming
- Scalable terrain architecture
- Better procedural extensibility

Target: perceived scale, not literal scale. No Earth-scale realism or astronomical precision.

## Terrain Systems (Future)

- Chunk streaming
- LOD systems
- Procedural generation
- Biome masking
- Async generation

Terrain complexity introduced only after flight feel and atmosphere are solid.

## Input Architecture

- Abstracted, action-based, device-agnostic
- No keyboard-hardcoded logic
- Future support: controller, touch, alternate devices — without rewriting gameplay

## Atmosphere Pipeline

- Sky gradients
- Fog / horizon haze
- Cloud layers
- Lighting
- Color grading
- Soft postprocessing

Atmosphere is a primary scale illusion mechanism. Prioritized early.

## Rendering Constraints (Awareness)

Stay aware of: draw call limits, browser memory pressure, WebGL limitations, shader compilation costs, procedural generation costs, GC spikes.

But: premature optimization avoided.

## Subsystem Boundaries

The project is organized into isolated subsystems. Each communicates through explicit, documented interfaces — never through shared mutable state or implicit dependencies.

| Subsystem | Responsibility | Interface |
|-----------|---------------|-----------|
| Rendering | Three.js/R3F scene, materials, shaders, postprocessing | Receives scene state, emits frames |
| Flight | Paper plane movement, physics, camera | Receives input actions, emits transform |
| Input | Action abstraction over keyboard/controller/touch | Emits action events |
| Terrain | Cube-sphere generation, chunk streaming, LOD | Emits geometry + collision data |
| Atmosphere | Sky, fog, lighting, color grading | Receives world state, modifies scene |
| Audio | Spatial audio, ambient, music | Receives events, emits nothing |
| UI | HUD, menus, overlays | Receives game state, renders 2D |

Agents must respect these boundaries. Tight coupling is a review rejection reason.

## Performance Stance

Optimization is deferred until systems stabilize, rendering pipeline matures, and terrain architecture solidifies. Early development prioritizes experimentation, emotional quality, and architecture validation.
