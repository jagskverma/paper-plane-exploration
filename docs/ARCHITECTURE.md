# Architecture

## Architecture Philosophy

This project prioritizes:

- Emotional coherence
- Atmospheric quality
- Traversal feel
- Maintainability
- Iteration speed
- Scalable simplicity

Over:

- Technical maximalism
- Speculative abstractions
- Enterprise-style architecture
- Premature optimization

The architecture should remain modular, explicit, understandable, and refactor-friendly.

The project is intentionally developed through iterative vertical slices — every phase must produce visible progress, runnable output, and experiential feedback. Giant infrastructure phases, overbuilt engine systems, speculative frameworks, and abstraction-heavy architecture are explicitly avoided.

---

## Primary Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Rendering | Three.js + React Three Fiber | Browser-native, strong procedural ecosystem, shader flexibility, atmospheric capability |
| Language | TypeScript | Maintainability, tooling quality, safer refactors, explicit interfaces |
| Build | Vite + pnpm | Fast iteration, lightweight, browser-focused, monorepo-capable |

Browser-native, client-side only. No mandatory backend or server dependency.

---

## Platform Strategy

| Phase | Target |
|-------|--------|
| Initial | PC browser |
| Future | Mobile browser / packaged mobile |

PC-first development with mobile-aware architecture. Scalable, quality-adjustable rendering systems. No premature mobile optimization.

---

## Repository Structure

### Current (Phase 0)

```
paper-plane-exploration/
├── README.md
├── docs/
│   ├── VISION.md
│   ├── ARCHITECTURE.md
│   ├── RULES.md
│   ├── ROADMAP.md
│   ├── TASK_TEMPLATE.md
│   ├── PROJECT_STATE.md
│   └── decisions/
├── game/                    # Phase 1+
├── agent-prompts/           # Phase 1+
├── research/                # Experiments, spikes
└── benchmarks/              # Phase 16+
```

### Intended (Phase 1+)

```
paper-plane-exploration/
├── apps/
│   └── web/                 # Main browser application
│       ├── src/
│       └── package.json
├── packages/                # Shared libraries (future)
├── docs/
│   ├── decisions/
│   ├── research/
│   ├── benchmarks/
│   ├── prompts/
│   └── references/
└── prototypes/              # Throwaway experiments
```

Directories are created as needed, not all at once. The monorepo structure with `apps/` and `packages/` supports future expansion without premature complexity.

---

## Web Application Structure (Phase 1+)

```
apps/web/src/
├── core/                    # Engine bootstrap, lifecycle, config
├── rendering/               # Scene, camera, materials, postprocessing
├── flight/                  # Paper plane movement, physics, feel
├── world/                   # Planet, coordinate systems, gravity
├── terrain/                 # Chunk streaming, LOD, generation
├── procedural/              # Noise, biome masking, generation rules
├── shaders/                 # GLSL modules, shared uniforms
├── ui/                      # HUD, menus, overlays
├── audio/                   # Spatial audio, ambient, music
├── hooks/                   # Shared React hooks
└── utils/                   # Math, helpers, constants
```

This structure is organizational guidance and subsystem boundary definition — not rigid enterprise layering. Folders evolve as needed.

---

## Core Architectural Principles

### 1. Explicitness Over Magic

Prefer direct logic, readable code, obvious ownership, and explicit data flow. Avoid hidden behavior, excessive indirection, magical abstractions, and overly dynamic systems. The codebase should remain understandable by inspection.

### 2. Simplicity Before Generalization

Implement concrete solutions first. Generalize only after patterns are proven necessary. Avoid speculative abstractions, premature framework creation, and future-proofing architecture.

### 3. Local Reasoning

Subsystems should remain understandable in isolation. A developer should be able to inspect a subsystem, understand its ownership, and understand its dependencies without requiring global mental context.

### 4. Refactorability

The architecture optimizes for safe future change rather than initial perfection. Early systems are expected to evolve. Avoid rigid architecture and overcommitment to early abstractions.

---

## High-Level System Separation

The project architecture must maintain strong separation between:

- Rendering
- Flight / Gameplay
- Terrain
- Procedural Generation
- World Systems (coordinate frames, gravity)
- Shaders
- UI / Audio
- Tooling

The goal is to reduce hidden coupling, cascading refactors, and system entanglement.

Subsystems communicate through explicit data flow, well-defined interfaces, and predictable ownership. Avoid implicit global dependencies, tightly coupled systems, and hidden mutation patterns.

### Subsystem Boundaries

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

---

## Rendering Architecture

Rendering should remain scalable, quality-adjustable, and atmosphere-focused. The rendering pipeline prioritizes:

- Traversal readability
- Horizon depth
- Fog
- Lighting
- Atmospheric scale illusion

Over graphical maximalism, photorealism, or extreme geometric density.

### Rendering Responsibilities

The rendering layer owns:
- Scene composition
- Lighting
- Atmosphere
- Materials
- Shaders
- Postprocessing
- Camera systems

The rendering layer does NOT own:
- Gameplay logic
- Procedural generation rules
- Terrain simulation logic

### Rendering Constraints

Stay aware of: draw call limits, browser memory pressure, WebGL limitations, shader compilation costs, procedural generation costs, GC spikes. Premature optimization is avoided.

---

## Gameplay Architecture

Gameplay systems should remain lightweight, traversal-focused, and emotionally supportive. The project is NOT intended to become systems-heavy, mechanic-heavy, RPG-like, or simulation-heavy.

Gameplay architecture prioritizes clarity, responsiveness, and extensibility without introducing excessive system complexity.

---

## Flight System Architecture

The flight system is a primary emotional system. It must remain isolated, tunable, and iteration-friendly.

Important concerns:
- Momentum
- Banking
- Smoothing
- Traversal flow
- Camera feel

Flight systems should remain decoupled from terrain generation, rendering internals, and biome systems where possible.

---

## Planet Architecture

The world topology is **cube sphere**. This decision is intentional and foundational.

Reasons:
- Scalable chunk subdivision (quad-tree per face)
- Reduced pole distortion
- Improved LOD behavior
- Cleaner streaming architecture
- Future procedural scalability

This decision is architecturally stable. Avoid UV sphere topology, infinite flat terrain, and Earth-scale realism. The project targets perceived scale, not literal scale.

See: `docs/decisions/001-cube-sphere-topology.md`

---

## Terrain Architecture

Terrain systems should eventually support:
- Chunk streaming
- LOD
- Async generation
- Biome masking
- Procedural displacement

Terrain complexity evolves incrementally — introduced only after flight feel and atmosphere are solid.

Terrain architecture prioritizes scalability, streaming stability, memory discipline, and traversal smoothness — NOT geological realism or simulation complexity.

---

## Procedural Generation Philosophy

Procedural systems exist to support exploration, atmosphere, traversal variety, and emotional discovery — NOT procedural maximalism.

Procedural generation must remain:
- Controllable
- Art-directable
- Deterministic where needed

Avoid uncontrolled randomness, unreadable generation pipelines, and deeply nested procedural systems.

---

## Shader Architecture

Shaders must remain modular, reusable, and focused. Shader systems prioritize atmosphere, readability, and performance scalability.

Avoid giant monolithic shaders and premature shader abstraction systems. One source of truth per shader — no duplication.

---

## Atmosphere Pipeline

- Sky gradients
- Fog / horizon haze
- Cloud layers
- Lighting
- Color grading
- Soft postprocessing

Atmosphere is a primary scale illusion mechanism. Prioritized early.

---

## Performance Philosophy

Performance awareness is important, but premature optimization is explicitly discouraged.

Early priorities: architecture clarity, movement feel, atmospheric quality, traversal experience.

Optimization phases happen later — after system stabilization, architectural validation, and rendering maturity.

### Planned Optimization Areas (Future)

- Terrain generation
- Chunk streaming
- Memory allocation
- Geometry generation
- Draw call reduction
- Shader cost
- Culling systems

Optimization must remain benchmark-driven, measurable, and reviewable. Avoid speculative micro-optimization, readability destruction, and architecture corruption for minor gains.

---

## State Management Philosophy

Prefer localized state, explicit ownership, and simple data flow. Avoid unnecessary global state, excessive state frameworks, and hidden synchronization systems. State complexity evolves only when necessary.

---

## Input Architecture

Input systems must remain action-based, device-agnostic, and scalable. Avoid keyboard-hardcoded gameplay assumptions.

Future compatibility for controller support, touch controls, and alternate input methods must remain possible without major rewrites.

---

## Dependency Philosophy

Dependencies must remain minimal, intentional, and justified. Avoid dependency-heavy architecture, utility-library sprawl, and framework stacking.

Every added dependency must have: clear purpose, measurable value, and low architectural cost.

---

## AI-Assisted Development Constraints

Implementation agents must follow project doctrine, respect scope boundaries, avoid speculative systems, and explain architectural decisions. They must NOT redefine architecture, introduce major frameworks, invent project direction, or expand scope autonomously.

All major architectural changes must be reviewed, intentional, and documented.

See `docs/RULES.md` for full agent rules and forbidden patterns.

---

## Long-Term Architectural Goal

The architecture should support atmospheric exploration, scalable procedural traversal, maintainable iteration, and gradual complexity growth — without collapsing into engine-development obsession, framework complexity, or technical overreach.

The architecture exists to support emotional experience first.
