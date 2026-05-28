# Task Template

Every agent task must follow this structure. No exceptions.

---

```markdown
# Objective
What are we building? One sentence.

# Why
Why does this subsystem exist? What problem does it solve?

# Constraints
Performance limits, architecture boundaries, style requirements. What must NOT change.

# Existing Context
Relevant systems already in the codebase. Files, modules, interfaces to be aware of.
What decisions have already been made that constrain this task.

# Deliverables
Exact expected outputs. Files, functions, types, tests. Be specific.

# Acceptance Criteria
How we know it works. Observable, testable conditions.

# Non-Goals
What NOT to implement. Explicitly exclude scope creep targets.

# Technical Notes
Optional implementation guidance, references, gotchas, ADR numbers.
```

---

## Rules for Writing Tasks

1. **One task = one subsystem outcome.** Never "build terrain engine." Instead: "implement quadtree chunk subdivision for cube-sphere terrain."
2. **Constraints are as important as objectives.** The "what NOT to do" prevents scope creep.
3. **Acceptance criteria must be observable.** "It works" is not a criterion. "Paper plane banks left when pressing A, returns to neutral when released, with visible roll within 500ms" is.
4. **Non-Goals prevent mission creep.** Be explicit about what the agent should NOT touch.
5. **Technical Notes are hints, not orders.** The agent may discover better approaches, but must justify deviations.

## Example

```markdown
# Objective
Implement momentum-based banking for the paper plane.

# Why
Banking turns are the primary visual feedback for flight feel. Without them, flight looks static and ungrounded.

# Constraints
- Must work with the existing action-based input system
- No direct keyboard polling
- Bank angle must smoothly interpolate (no snapping)
- Max bank angle: 35 degrees
- Must not affect camera directly (camera is a separate subsystem)

# Existing Context
- `src/flight/FlightController.ts` handles input → motion mapping
- `src/flight/PlaneTransform.ts` exposes current rotation quaternion
- Input actions: `BANK_LEFT`, `BANK_RIGHT`, `BANK_NEUTRAL`

# Deliverables
- `src/flight/BankingSystem.ts` — new file
- Modified `FlightController.ts` to call BankingSystem
- Unit test: `src/flight/__tests__/BankingSystem.test.ts`

# Acceptance Criteria
- Pressing BANK_LEFT rotates plane around forward axis toward -35° over ~600ms
- Pressing BANK_RIGHT rotates toward +35° over ~600ms
- Releasing to BANK_NEUTRAL returns to 0° over ~400ms
- Bank transitions use ease-in-out curve (no linear interpolation)
- No visual snapping or jitter

# Non-Goals
- Do NOT modify camera damping
- Do NOT touch input system
- Do NOT add sound effects
- Do NOT implement pitch banking (that's a separate task)

# Technical Notes
- See ADR-001: cube-sphere topology (banking must work in local tangent frame)
- Reference: `docs/decisions/001-cube-sphere-topology.md`
```
