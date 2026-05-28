# Roadmap

## Production Philosophy

The project evolves in this order:

```
Feel → Atmosphere → Traversal → Scale → Variety → Content → Polish
```

NOT:

```
Features → More Features → More Features
```

That distinction separates memorable atmospheric experiences from dead procedural tech demos.

Gameplay comes late — intentionally. This genre succeeds emotionally first, mechanically second. The game's identity is movement, atmosphere, scale, and exploration feeling — not mechanics, progression trees, combat, or systems complexity.

---

## Phase Overview

| # | Phase | Status | Difficulty |
|---|-------|--------|------------|
| 0 | Project Governance | ✅ done | Low |
| 1 | Engine Foundation | pending | Low |
| 2 | Flight Feel Prototype | pending | ⚠️ Surprisingly Hard |
| 3 | Atmospheric Rendering | pending | 🎨 Artistically Hard |
| 4 | Spherical Traversal Prototype | pending | Medium |
| 5 | Planet Topology & Coordinate Systems | pending | Medium |
| 6 | Terrain Architecture Research | pending | Medium |
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

**Gate:** If this is not achieved, do not proceed to terrain.

### Milestone 2: Spherical World Traversal
**Phases 4–5**

Paper plane traverses a cube-sphere planet. Seamless. Proper gravity alignment. Curved-horizon movement. Scale illusion holds up.

### Milestone 3: Living World
**Phases 6–12**

Terrain streams. Biomes vary. Oceans reflect. Weather moves. Landmarks invite exploration. The world feels worth wandering. 10–20 minutes of traversal before repetition.

### Milestone 4: Complete Experience
**Phases 13–19**

Audio, polish, performance, UX, save/seeds, packaging. Ship-ready.

### Milestone 5: Long-Term
**Phases 20–21**

Content expansion and architectural cleanup after real-world scaling.

---

## Risk Zones

These are the phases most likely to cause trouble:

| Phase | Risk | Why |
|-------|------|-----|
| 2 — Flight Feel | ⚠️ High | Feel is subjective. Requires many iteration loops. Easy to over-engineer or under-deliver. |
| 3 — Atmosphere | 🎨 High | Artistic, not technical. Hard to tune. Easy to make "generic sky." |
| 7 — Terrain Streaming MVP | 🔴 Critical | Cube-sphere chunk streaming with LOD in a browser is genuinely hard. Most likely phase to fail. |
| 8 — Terrain Stability | 🔴 Critical | Seams, cracks, popping, memory pressure, GC spikes. Death by a thousand edge cases. |
| 16 — Performance | 🔴 Critical | Browser profiling is unforgiving. Easy to optimize the wrong thing. Must be data-driven. |

---

## Phase Details

To be filled in as each phase approaches.
