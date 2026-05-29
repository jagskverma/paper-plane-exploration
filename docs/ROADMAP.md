# Roadmap

## Roadmap Philosophy

This roadmap defines development sequencing, architectural priorities, and system evolution order. It does NOT define timelines, deadlines, or release schedules.

The project evolves organically through iterative vertical slices. Every phase produces visible progress, remains runnable, preserves emotional feedback, and validates assumptions early.

The roadmap is directional, not temporal. It exists to prevent chaotic development, reduce uncontrolled complexity, maintain emotional focus, and preserve architectural discipline.

---

## Core Development Principle

```
Movement Feel
    ↓
Atmosphere
    ↓
Traversal
    ↓
Scale Illusion
    ↓
Paper Plane Scale
    ↓
Terrain
    ↓
Biome Variety
    ↓
Exploration Content
    ↓
Optimization
    ↓
Polish
```

NOT:

```
Features → More Features → More Features
```

The project prioritizes emotional experience first. If a feature does not improve the emotional flying experience, reconsider it.

---

## Phase Overview

| # | Phase | Status | Difficulty |
|---|-------|--------|------------|
| 0 | Project Governance | ✅ done | Low |
| 1 | Engine Foundation | ✅ done | Low |
| 2 | Flight Feel Prototype | ✅ done | ⚠️ Surprisingly Hard |
| 3 | Atmospheric Rendering | ✅ done | 🎨 Artistically Hard |
| 4 | Spherical Traversal Prototype | ✅ done | Medium |
| 5 | Planet Topology & Coordinate Systems | ✅ done | Medium |
| 5.5 | Paper Plane Scale & Ground-Proximity Feel | in progress | ⚠️ Feel-Critical |
| 6 | Terrain Architecture Research | drafted | Medium |
| 7 | Terrain Streaming MVP | pending | 🔴 Extremely Hard |
| 8 | Terrain Stability & Optimization | pending | 🔴 Extremely Hard |
| 9 | Biome Generation System | pending | Medium |
| 10 | Ocean & Water Systems | pending | Medium |
| 11 | Cloud & Weather Systems | pending | Medium |
| 12 | World Landmark Generation | pending | Medium |
| 13 | Exploration Gameplay Layer | pending | Low |
| 14 | Audio & Soundscape | pending | Low |
| 15 | Rendering Polish | pending | Medium |
| 16 | Performance Optimization | pending | 🔴 Brutal |
| 17 | UX & Accessibility | pending | Low |
| 18 | Save/Seed Systems | pending | Low |
| 19 | Packaging & Distribution | pending | Low |
| 20 | Content Expansion | pending | Medium |
| 21 | Long-Term Refactor Pass | pending | Medium |

---

## Key Milestones

### Milestone 1: Beautiful Flight in Empty Space
**Phases 1–3**

Paper plane flies through atmospheric void. Movement feels good. Atmosphere is emotionally compelling. No terrain, no world — just sky and flight.

**Gate:** If movement is not satisfying and traversal is not emotionally compelling, do not proceed to terrain.

### Milestone 2: Spherical World Traversal
**Phases 4–5**

Paper plane traverses a cube-sphere planet. Seamless. Proper gravity alignment. Curved-horizon movement. Scale illusion holds up.

### Milestone 2.5: Real Paper Plane Scale
**Phase 5.5**

The player flies low enough that the environment matters. Terrain, trees, rocks, and small props should pass near the plane at paper-plane scale. The flight feel should be gliding, light, vulnerable, and close to the ground, not aircraft-like cruising above landscape.

**Gate:** Do not proceed into full terrain streaming until low-altitude flight feels credible with placeholder terrain objects. If flying low is not satisfying, streaming more terrain will scale the wrong experience.

### Milestone 3: Living World
**Phases 6–12**

Terrain streams. Biomes vary. Oceans reflect. Weather moves. Landmarks invite exploration. The world feels worth wandering. 10–20 minutes of traversal before repetition.

### Milestone 4: Complete Experience
**Phases 13–19**

Audio, exploration systems, polish, performance, UX, save/seeds, packaging. Ship-ready.

### Milestone 5: Long-Term
**Phases 20–21**

Content expansion and architectural cleanup after real-world scaling.

---

## Risk Zones

| Phase | Risk | Why |
|-------|------|-----|
| 2 — Flight Feel | ⚠️ High | Feel is subjective. Requires many iteration loops. Easy to over-engineer or under-deliver. |
| 3 — Atmosphere | 🎨 High | Artistic, not technical. Hard to tune. Easy to make "generic sky." |
| 5.5 — Paper Plane Scale | ⚠️ High | This determines whether the game feels like a paper plane or a small aircraft. Requires tight iteration on altitude, speed, camera, and nearby object scale. |
| 7 — Terrain Streaming MVP | 🔴 Critical | Cube-sphere chunk streaming with LOD in a browser. Most likely phase to fail. |
| 8 — Terrain Stability | 🔴 Critical | Seams, cracks, popping, memory pressure, GC spikes. Death by a thousand edge cases. Most procedural projects fail here. |
| 16 — Performance | 🔴 Critical | Browser profiling is unforgiving. Easy to optimize the wrong thing. Must be data-driven. |

## Realistic Timeline Estimates

| Stage | Approximate | Notes |
|-------|-------------|-------|
| Fun flight prototype (Phases 1–3) | 1–3 weeks | Iteration-heavy. Feel tuning takes time. |
| Stable spherical traversal (Phases 4–5) | 2–6 weeks | Coordinate systems are finicky. |
| Paper-plane scale correction (Phase 5.5) | 1–2 weeks | Must be playtested. Small numerical changes have large feel impact. |
| Good terrain architecture (Phases 6–8) | 1–3 months | This is The Monster. Most common death zone. |
| Convincing atmosphere | Ongoing | Continuously refined across all phases. |
| "Feels like a real game" (Phases 13+) | Several months | Depends heavily on foundation quality. |

Never enter "months of infrastructure building." A runnable prototype must exist at all times.

---

## Phase Details

### Phase 0 — Project Governance ✅

**Goal:** Establish repository structure and development governance.

**Focus:** Scaffolding, documentation, workspace structure, operational constraints, architectural doctrine.

**Success Criteria:** Clear, consistent, maintainable project foundation.

**Avoid:** Implementing gameplay, rendering systems, or terrain systems.

---

### Phase 1 — Engine Foundation

**Goal:** Create stable browser rendering foundation.

**Focus:** Three.js integration, React Three Fiber setup, TypeScript foundation, render loop, scene organization, debugging infrastructure, hot reload workflow.

**Success Criteria:** Stable rendering environment, fast iteration workflow, clean project structure.

**Avoid:** Gameplay complexity, terrain systems, speculative architecture.

---

### Phase 2 — Flight Feel Prototype ⚠️

**Goal:** Create emotionally satisfying flight movement.

**Focus:** Paper plane controls, momentum, banking, camera smoothing, traversal flow, glide feel.

**Environment:** Mostly empty atmospheric space.

**Success Criteria:** Flying alone is enjoyable.

**Avoid:** Terrain systems, procedural complexity, large world systems.

This is one of the most important phases. The project should NOT scale complexity until movement feels satisfying and traversal feels emotionally compelling.

---

### Phase 3 — Atmospheric Rendering 🎨

**Goal:** Establish emotional visual identity.

**Focus:** Sky rendering, fog, lighting, horizon haze, cloud layers, color grading, atmospheric depth.

**Success Criteria:** Atmospheric traversal feels beautiful even without terrain.

**Avoid:** Visual maximalism, photorealism, expensive rendering complexity.

Atmosphere should create perceived scale, emotional tone, and traversal immersion.

---

### Phase 4 — Spherical Traversal Prototype

**Goal:** Validate spherical world traversal.

**Focus:** Cube-sphere traversal, gravity alignment, curved horizon behavior, stable camera orientation, local coordinate systems.

**Success Criteria:** Seamless traversal across curved world surface.

**Avoid:** Massive terrain systems, biome systems, streaming complexity.

This phase validates movement stability, traversal correctness, and planetary movement assumptions.

---

### Phase 5 — Planet Topology & Coordinate Systems

**Goal:** Stabilize planetary coordinate architecture.

**Focus:** Cube-sphere consistency, precision handling, orientation stability, traversal continuity, local space correctness.

**Success Criteria:** Stable foundation for scalable world systems.

**Avoid:** Rushing into terrain before topology is solid.

This phase reduces future architectural instability, scaling problems, and precision-related refactors.

---

### Phase 5.5 — Paper Plane Scale & Ground-Proximity Feel ⚠️

**Goal:** Correct moment-to-moment scale so the game feels like a real paper plane gliding through a low-poly world.

**Why this phase exists:** The current architecture can traverse a spherical world, but the feel target has drifted toward “small aircraft over terrain.” A real paper plane experience depends on low altitude, nearby objects, gentle vulnerability, and close terrain reading. This phase validates that core experience before expensive terrain streaming work.

**Focus:**
- Low-altitude flight measured in meters above ground level, not high planetary cruising.
- Cruise target around 8-15m AGL, with room to tune after playtesting.
- Terrain amplitude and frequency scaled to make low flight safe but visually interesting.
- Paper-plane glide behavior: light, unpowered, slightly lossy, responsive but not aircraft-precise.
- Close chase camera tuned for nearby object parallax and readable paper-plane orientation.
- AGL debug readout and ground-proximity safety behavior.
- A tiny curated placeholder object set: trees, rocks, shrubs, and maybe one simple structure only for scale validation.

**Success Criteria:**
- The player can fly close to the ground without constant clipping.
- Terrain feels near enough to matter at neutral cruise.
- Pitching down creates a visible approach toward terrain.
- Pitching up gives a brief climb but should not feel like powered aircraft ascent.
- Banking creates readable arcing turns at low altitude.
- Nearby trees or rocks pass close enough to create paper-plane scale.
- Placeholder assets demonstrate “flying between objects” without becoming a content phase.

**Avoid:**
- Full procedural object placement systems.
- Biome variety.
- Terrain streaming.
- Large asset ingestion.
- Complex collision volumes for every asset.
- Turning this into a general environment engine.

**Asset Usage:**
Use the local asset library documented in `docs/references/ASSET_LIBRARY.md`. Select only a few low-poly `.glb` assets for scale testing. Poly Pizza Nature is the preferred first source for trees, rocks, and grass because it is already `.glb` and likely browser-friendly.

**Expected Deliverables:**
- Tuned `worldConfig` values for low-altitude paper-plane scale.
- Flight model changes for glide/sink/climb behavior.
- Camera tuning for low-altitude traversal.
- Terrain-aware AGL debug display.
- Minimal scale-test object component using 2-5 curated assets.
- Short playtest notes describing whether flying between objects feels credible.

---

### Phase 6 — Terrain Architecture Research

**Goal:** Research scalable procedural terrain architecture before implementation.

**Focus:** Chunk systems, quadtree subdivision, LOD strategies, crack prevention, memory management, async generation, streaming approaches.

**Success Criteria:** Clear terrain architecture strategy, identified technical risks, incremental implementation plan.

**Avoid:** Rushing directly into implementation without a plan. Do not proceed if Phase 5.5 has not validated low-altitude paper-plane scale.

This phase is research-first. Do NOT skip it.

---

### Phase 7 — Terrain Streaming MVP 🔴

**Goal:** Implement foundational scalable terrain streaming.

**Focus:** Chunk loading/unloading, terrain subdivision, basic LOD, simple procedural displacement, streaming lifecycle, culling.

**Success Criteria:** Stable traversable procedural terrain, scalable streaming behavior, acceptable performance.

**Avoid:** Biome complexity, visual polish, excessive procedural layers.

---

### Phase 8 — Terrain Stability & Optimization 🔴

**Goal:** Stabilize terrain systems for long traversal sessions.

**Focus:** Crack stitching, transition smoothness, streaming stability, memory behavior, traversal continuity, generation consistency.

**Success Criteria:** Stable traversal without major visual artifacts, reliable streaming, scalable world traversal.

**Avoid:** Premature visual polish at the expense of stability.

This phase is critical. Most procedural projects fail here.

---

### Phase 9 — Biome Generation System

**Goal:** Create environmental variety and exploration contrast.

**Focus:** Biome masking, terrain variation, environmental palettes, regional transitions, stylized environmental identity.

**Biome examples:** Mountains, valleys, oceans, cliffs, surreal regions, atmospheric zones.

**Success Criteria:** Exploration feels varied and interesting. Biomes feel emotionally distinct and visually memorable.

**Avoid:** Mechanical complexity within biomes.

---

### Phase 10 — Ocean & Water Systems

**Goal:** Create stylized atmospheric water rendering.

**Focus:** Ocean rendering, shoreline transitions, reflections, atmospheric water behavior, horizon integration.

**Success Criteria:** Water supports scale illusion, atmosphere, and traversal beauty.

**Avoid:** Physical simulation realism.

---

### Phase 11 — Cloud & Weather Systems

**Goal:** Enhance environmental atmosphere and perceived scale.

**Focus:** Cloud layers, fog systems, storm regions, wind variation, atmospheric transitions.

**Success Criteria:** World feels alive and dynamic.

**Avoid:** Overcomplicating weather simulation.

Weather systems should support emotional traversal, environmental diversity, and visual pacing.

---

### Phase 12 — World Landmark Generation

**Goal:** Introduce memorable exploration moments.

**Focus:** Large formations, strange structures, floating geometry, ruins, arches, surreal landmarks.

**Success Criteria:** Landmarks create curiosity, surprise, and emotional memory. The world shifts from procedural terrain to experiential exploration.

**Avoid:** Over-producing landmarks — they should feel rare and special.

---

### Phase 13 — Exploration Gameplay Layer

**Goal:** Add lightweight exploration-oriented gameplay systems.

**Potential systems:** Discovery tracking, traversal incentives, environmental interaction, lightweight progression.

**Success Criteria:** Gameplay feels minimal, supportive, and atmosphere-friendly.

**Avoid:** Feature bloat, RPG complexity, system overload.

---

### Phase 14 — Audio & Soundscape

**Goal:** Create immersive atmospheric audio identity.

**Focus:** Ambient layers, wind audio, biome soundscapes, traversal feedback, dynamic music systems.

**Success Criteria:** Audio supports emotional immersion, scale perception, and traversal mood.

**Avoid:** Overproduced audio that distracts from atmosphere.

This phase is considered emotionally important.

---

### Phase 15 — Rendering Polish

**Goal:** Refine visual cohesion and atmosphere quality.

**Focus:** Shader refinement, lighting polish, postprocessing tuning, color scripting, visual readability, atmospheric consistency.

**Success Criteria:** Improved emotional cohesion, visual identity, and presentation quality.

**Avoid:** Unnecessary graphical escalation.

---

### Phase 16 — Performance Optimization 🔴

**Goal:** Stabilize long-session performance and scalability.

**Focus:** Terrain generation performance, streaming performance, memory behavior, draw call reduction, shader cost, culling, browser stability.

**Success Criteria:** Smooth long-duration traversal with stable frame rates.

**Avoid:** Readability destruction, architecture corruption for micro-optimizations.

Optimization must be benchmark-driven, measurable, and reviewable. Potential future tooling: automated benchmark systems, AI-assisted optimization loops, profiling dashboards.

---

### Phase 17 — UX & Accessibility

**Goal:** Improve usability and accessibility.

**Focus:** Menus, graphics settings, controls, rebinding, quality presets, accessibility features.

**Success Criteria:** UX remains lightweight, readable, and atmosphere-compatible.

**Avoid:** Heavy UI that breaks immersion.

---

### Phase 18 — Save/Seed Systems

**Goal:** Enable persistent and replayable worlds.

**Focus:** Deterministic world seeds, persistent settings, replayable worlds, lightweight progression state.

**Success Criteria:** Players can save settings, revisit worlds via seed, and maintain progression across sessions.

**Avoid:** Complex save-state architecture, server-side persistence requirements.

---

### Phase 19 — Packaging & Distribution

**Goal:** Prepare deployment and long-term delivery strategy.

**Focus:** Browser deployment, PWA support, scalability testing, packaging strategy, future mobile adaptation.

**Success Criteria:** Deployable to PC browser without sacrificing project identity or atmospheric quality.

**Avoid:** Premature mobile optimization that compromises the core experience.

---

### Phase 20 — Content Expansion

**Goal:** Expand world richness after foundation is stable.

**Focus:** Additional biomes, weather types, world anomalies, traversal mechanics, experimental environmental experiences.

**Success Criteria:** World depth increases without architectural regression.

**Avoid:** Feature creep, scope expansion that undermines stability.

---

### Phase 21 — Long-Term Refactor Pass

**Goal:** Refine architecture after real-world scaling experience.

**Focus:** Technical debt cleanup, simplification, architectural stabilization, future extensibility.

**Success Criteria:** Maintainable, clear, iteration-friendly codebase.

**Avoid:** Rewriting working systems, introducing new complexity under the guise of cleanup.

---

## Guiding Principle

The project should continuously ask:

> "Does this improve the emotional flying experience?"

If the answer is unclear, the feature or system should be reconsidered.

The project succeeds through atmosphere, traversal, scale illusion, and emotional coherence — NOT through feature quantity, technical maximalism, or procedural complexity alone.
