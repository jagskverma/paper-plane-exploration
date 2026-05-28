# Review Checklist

> Pre-merge gate for every PR. All items must pass before merge.

## Architecture Compliance

- [ ] **Subsystem boundary respected?** Code touches only its assigned subsystem. No imports from forbidden subsystems (see subsystem table in AGENTS.md).
- [ ] **No forbidden patterns?** No ECS, DI, event buses, plugins, hidden globals, deep inheritance.
- [ ] **No speculative abstractions?** Code solves the current problem, not imagined future ones.
- [ ] **Concrete before general?** Generalization only if the pattern is already proven across 2+ concrete use cases.

## Dependencies

- [ ] **No new dependency without justification?** Every new package has a documented purpose and no simpler alternative exists.
- [ ] **No utility-library sprawl?** Small helper functions are in-project, not imported.

## Code Quality

- [ ] **Understandable by inspection?** A developer unfamiliar with the codebase can read it and understand what it does.
- [ ] **Architectural reasoning in PR description?** Why this approach, what alternatives were rejected, what are the tradeoffs.
- [ ] **No magic?** No hidden behavior, no implicit global dependencies, no overly dynamic patterns.

## Task Scope

- [ ] **Scope matches task spec?** Delivers exactly what was asked for — no scope creep, no "while I was in there" additions.
- [ ] **Non-goals respected?** Didn't touch systems listed as off-limits in the task spec.
- [ ] **Acceptance criteria met?** Every criterion from the task spec is verifiably satisfied.

## Phase Discipline

- [ ] **Right priority order?** Work advances the current priority (movement > atmosphere > terrain > optimization > polish).
- [ ] **No premature optimization?** No performance work unless we're in Phase 16 or the code is provably broken.

## Specific Checks

- [ ] **Terrain code in render loop?** Reject.
- [ ] **Hardcoded biome data?** Reject — all biome data is data-driven.
- [ ] **Shader duplicated?** Reject — one source of truth per shader.
- [ ] **Keyboard-hardcoded input?** Reject — all input is action-based.
- [ ] **Tight coupling between subsystems?** Reject — explicit interfaces only.
- [ ] **New file outside assigned subsystem folder?** Justify.

## Meta

- [ ] **ADR needed?** If this PR introduces a significant architectural decision, an ADR must be created in `docs/decisions/`.
- [ ] **Docs updated?** If behavior changed, relevant docs reflect it.
