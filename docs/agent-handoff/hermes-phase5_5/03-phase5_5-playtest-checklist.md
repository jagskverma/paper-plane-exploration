# Objective

Create a concrete Phase 5.5 playtest checklist for low-altitude paper-plane feel.

# Why

We need repeatable observations instead of subjective one-off tuning.

# Constraints

- Documentation only.
- Do not change code.
- Keep it specific to the current prototype controls and HUD.
- Keep checks observable and repeatable.

# Existing Context

- `docs/ROADMAP.md`
- `docs/PROJECT_STATE.md`
- `apps/web/src/ui/DebugHud.tsx`
- Current target: procedural paper plane, low-poly world, low-altitude flight around 12m AGL.

# Deliverables

- Add `docs/playtests/phase5_5-playtest-checklist.md`.

# Acceptance Criteria

Checklist includes pass/fail checks for:

- Neutral flight altitude hold
- Pitch up behavior
- Pitch down behavior
- Bank left behavior
- Bank right behavior
- Flying between two trees
- Flying near rocks and bushes
- Camera readability
- Paper-plane model readability
- Collision behavior
- Whether the scene feels like a paper plane near ground objects rather than an aircraft high above terrain
- Gate criteria for moving on to Phase 6/7

# Non-Goals

- No code changes.
- No new roadmap phases.
- No implementation planning beyond playtest gates.

# Technical Notes

- Keep checklist practical enough to run in 5-10 minutes.
- Include expected HUD ranges where useful, especially AGL.
