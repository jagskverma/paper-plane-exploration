# Objective

Add debug readout showing chunk count, vertex count, and terrain stats to the existing debug HUD or console.

# Why

Terrain streaming can silently degrade — chunks disappear, vertex counts spike, cache grows unbounded. A minimal readout catches these issues during development without requiring a full debug UI.

# Constraints

- Add metrics to the existing `DebugHud` in `apps/web/src/ui/DebugHud.tsx`, OR log to console every few seconds.
- Do not create a new UI component unless absolutely minimal.
- Do not import terrain internals into `ui/`. Pass metrics as props.
- Keep readout compact — one line of text.
- Do not add `stats.js` or external profiling libraries.

# Existing Context

- `apps/web/src/ui/DebugHud.tsx` — current flight HUD (altitude, speed, position, rotation)
- `apps/web/src/terrain/TerrainCache.ts` — cache with `.size` getter
- `apps/web/src/terrain/TerrainRoot.tsx` — renders chunks
- `apps/web/src/core/FlightScene.tsx` — wires components together

# Deliverables

- Extend `DebugHud` to optionally show terrain metrics:
  - Visible chunks: `N`
  - Generated chunks: `N`
  - Cache entries: `N`
  - Approximate vertices: `N` (chunks × 289)
- Or log to `console.log` every 5 seconds if adding to HUD is too invasive.
- Metrics come from `TerrainRoot` → `FlightScene` → HUD (via props or shared ref).

# Acceptance Criteria

- [x] `pnpm lint` and `pnpm build` pass.
- [x] When chunked terrain is active, metrics are visible (HUD or console).
- [x] Chunk count changes when viewer moves (if chunk selection is active).
- [x] No terrain internals leaked to `ui/`.

# Non-Goals

- No frame time or FPS display.
- No memory profiling.
- No GPU metrics.
- No graph or chart display.
- No developer tools panel.

# Technical Notes

The simplest approach: `TerrainRoot` accepts an optional `onMetrics` callback prop. `FlightScene` passes a function that updates a ref, and `DebugHud` reads that ref. This keeps terrain and UI decoupled. If too complex, just `console.log` from `TerrainRoot` every 5 seconds.
