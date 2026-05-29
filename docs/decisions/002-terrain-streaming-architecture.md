# ADR-002: Terrain streaming architecture

Date: 2026-05-29
Status: accepted

## Context

Phase 6 requires a terrain architecture strategy before implementing streaming terrain. The project already chose cube-sphere topology in ADR-001, and the current Phase 5 planet is a monolithic six-face render component. Phase 7 needs to move toward chunked terrain without introducing speculative engine infrastructure or coupling terrain to flight/rendering internals.

The key risks are face-edge seams, LOD cracks, geometry churn, render-loop generation, and uncontrolled abstraction growth.

## Decision

Use a per-face quadtree terrain model where each chunk is identified by:

```ts
face: 0 | 1 | 2 | 3 | 4 | 5
level: number
x: number
y: number
```

Terrain will own chunk identity, cube-sphere mapping, chunk selection, geometry generation, and cache disposal. The core scene will pass explicit viewer position into terrain. Terrain will not import flight internals.

Generation will start as deterministic synchronous chunk geometry outside the render loop. Worker-based generation may be introduced later only after the chunk lifecycle is proven.

Height evaluation will be based on normalized sphere direction, not face-local UV, so adjacent cube faces can agree on shared edge heights.

## Alternatives Considered

### Keep the monolithic cube sphere

- Pro: simplest and already visible.
- Con: cannot support streaming, LOD, or scalable terrain.
- Con: hides future seam and memory risks until too late.

### Build worker-first streaming terrain

- Pro: closer to long-term performance needs.
- Con: adds async complexity before chunk identity and LOD behavior are validated.
- Con: harder to debug visual seams and lifecycle bugs.

### Flat terrain chunks

- Pro: simpler chunk streaming.
- Con: contradicts ADR-001 and the spherical traversal vision.

### General terrain engine abstraction

- Pro: flexible in theory.
- Con: violates the project's anti-overengineering rules.
- Con: adds abstraction before there are real terrain variants to abstract over.

## Consequences

### Easier

- Chunk addresses are stable and inspectable.
- Terrain can evolve from fixed chunks to dynamic LOD without changing topology.
- Procedural height functions can remain deterministic across face edges.
- Flight stays decoupled from terrain implementation details.

### Harder

- Face adjacency and LOD seams still need careful handling.
- Chunk selection must account for spherical distance and horizon scale.
- Geometry disposal must be explicit to avoid memory growth.

### Deferred

- Worker generation.
- Smooth LOD morphing.
- Crack stitching or skirts.
- Biomes and material variety.
- Collision or terrain-following flight.
