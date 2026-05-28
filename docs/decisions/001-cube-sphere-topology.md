# ADR-001: Cube-sphere planet topology

Date: 2026-05-28
Status: accepted

## Context

The game world must be a finite spherical planet that the player can traverse seamlessly. We need to choose a geometric representation for the planetary surface. The representation affects LOD subdivision, procedural generation, chunk streaming, and visual quality.

## Decision

Use a **cube sphere** (a cube projected onto a sphere) as the planet topology.

## Alternatives Considered

### UV Sphere
- Pro: conceptually simple, standard in graphics
- Con: severe pole pinching — vertices cluster at poles causing wasted geometry and LOD distortion
- Con: non-uniform texel distribution makes procedural generation harder
- Con: harder to subdivide cleanly for chunk streaming

### Flat Infinite Terrain
- Pro: simplest to implement, well-understood chunk systems
- Con: does not support the spherical world vision
- Con: horizon curvature illusion is much harder to fake convincingly
- Con: no "fly around the world" experience

### Icosahedron Sphere
- Pro: more uniform triangle distribution than cube sphere
- Con: harder to reason about chunk addressing (triangular vs square)
- Con: less natural mapping to square heightmap chunks
- Con: fewer established LOD schemes for game terrain

### Cube Sphere (chosen)
- Pro: clean LOD subdivision — each face is a quad-tree-friendly square
- Pro: no pole distortion — all six faces have uniform sampling
- Pro: natural chunk addressing (face index + 2D quad-tree coordinates)
- Pro: well-established in games (Spore, Kerbal Space Program, Star Citizen)
- Pro: easy to map per-face heightmaps for procedural generation
- Con: slight geometric distortion near cube edges (acceptable at target scale)
- Con: requires seam handling at face boundaries (solvable, well-documented)

## Consequences

### Easier
- LOD subdivision: each face independently manages its own quad-tree
- Chunk streaming: square chunks map cleanly to worker-based generation
- Procedural generation: heightmaps are 2D arrays per face, standard noise functions work
- Addressing: natural coordinate system (face, u, v) for any surface point

### Harder
- Face-edge seams must be handled during generation and rendering
- Six separate face coordinate systems require projection/unprojection utilities
- Camera/Frustum culling must work across face boundaries
- Gravity/normal computation at face edges needs care

### Neutral
- Cube-sphere math utilities will be an early shared dependency
- Documentation for the coordinate system is essential for all agents working on terrain
