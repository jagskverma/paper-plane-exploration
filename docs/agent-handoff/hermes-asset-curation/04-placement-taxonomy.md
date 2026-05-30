# Objective

Write a placement taxonomy for how curated assets should be used in procedural scenery.

# Why

Procedural scenery needs rules, not just assets. We need to know which assets are common, rare, clustered, isolated, safe to fly through, or used as landmarks.

# Constraints

- Documentation only.
- Do not modify code.
- Keep rules Phase 7 appropriate.
- Do not introduce biomes yet.
- Avoid complex simulation or ecology.

# Existing Context

- `docs/assets/scenery-curation-manifest.json`
- Current procedural scenery file: `apps/web/src/world/ProceduralScenery.tsx`
- Current design target: low-poly paper-plane flight through nearby terrain objects.

# Deliverables

Create:

- `docs/assets/placement-taxonomy.md`

# Required Sections

1. `Purpose`
2. `Placement Roles`
3. `Density Bands`
4. `Altitude And Slope Rules`
5. `Collision Expectations`
6. `Starter Woodland Rules`
7. `Sparse Settlement Rules`
8. `Landmark Rules`
9. `Phase 7 Non-Goals`

# Required Rules

Include concrete recommendations for:

- common trees should be sparse enough to leave flight corridors
- bushes/rocks should mostly be ground detail, not mandatory hazards at 12m AGL
- landmarks should be rare and placed far enough apart to remain memorable
- structures should appear in small clusters, not cities
- procedural placement should avoid placing large objects directly on the initial spawn path unless intentional
- collision should use simple shapes:
  - tree trunk capsule + canopy sphere
  - rock/bush sphere
  - structures as rough box or sphere only after visual placement works

# Acceptance Criteria

- Rules are concrete enough to implement in `ProceduralScenery.tsx`.
- No biome system is required.
- No new roadmap phase is invented.

# Non-Goals

- No code.
- No asset copying.
- No final world generation system.
