# Rules & Constraints

## Core Principle

> The biggest risk is uncontrolled complexity growth. This project exists to resist entropy.

Agents optimize for "task completion." This project optimizes for "long-term coherence." When those conflict, coherence wins. Every rule below exists to prevent architectural chaos.

Ambiguity kills. Agents must never wonder: what matters most, what the aesthetic goal is, what tradeoffs are acceptable, or what phase the project is in.

---

## Development Rules

### Priority Order (Locked)

1. Movement feel
2. Atmosphere
3. Traversal pleasure
4. Scale illusion
5. Terrain systems
6. Biome variety
7. Content expansion
8. Optimization
9. Polish

Do NOT invert this order. If movement and atmosphere are not emotionally compelling, do not scale complexity further.

### Iterative Vertical Slices

Every phase must produce something playable, validate architecture, expose risks early, and preserve emotional feedback. The project remains continuously runnable, testable, and experiential.

Never develop horizontally (all terrain → all rendering → all biomes). Always develop vertically (one complete tiny playable experience).

No long infrastructure-only phases. No giant one-shot implementations.

### First Milestone Gate

Beautiful flight in atmospheric empty space. If this isn't achieved, terrain and content work does not begin.

### Rapid Iteration Mandate

The development setup must optimize for rapid experimentation. If iteration becomes slow, motivation dies.

Requirements:
- Instant hot-reload (Vite HMR — sub-second feedback)
- Tiny iteration loops (change shader → see result in <2 seconds)
- Quick playtesting (startup-to-flight in <5 seconds)
- No build-step friction during development

Any tooling, architecture, or workflow decision that slows the edit→preview loop is a regression. Fast iteration protects motivation and enables the feel-tuning that this project depends on.

---

## Forbidden Engineering Patterns

- Premature ECS (Entity Component System)
- Enterprise-style architecture
- Plugin systems
- Giant abstraction layers
- Speculative utility systems
- Hidden magic
- Excessive dependencies
- Uncontrolled global state
- Global mutable state (anywhere)
- Deep inheritance hierarchies
- Terrain generation inside the render loop
- Shader duplication (one source of truth per shader)
- Hardcoded biome data (all biome data is data-driven)
- Tight coupling between subsystems

---

## Preferred Engineering Patterns

- Clarity over cleverness
- Maintainability over abstraction
- Iteration speed over premature optimization
- Explicitness over implicit behavior
- Composability over monolithic systems

---

## Subsystem Isolation

Keep these isolated from each other:

- Rendering
- Procedural generation
- Flight / movement
- UI / HUD
- Input handling
- Audio

Agents tend to tightly couple things. Fight this aggressively. Each subsystem communicates through explicit, documented interfaces — never through shared mutable state or implicit dependencies.

---

## AI Agent Rules

### You Are Building TWO Projects

Most people miss this. You are actually building:

**Project A** — The game (paper plane, atmosphere, world, feeling).

**Project B** — The AI-assisted development pipeline (orchestration, agents, reviews, task specs).

Project B can consume infinite time if unmanaged. The pipeline exists to serve the game — never the reverse. If pipeline infrastructure work exceeds game work, something is wrong.

### Keep the Agent System Simple

Do NOT overbuild the agent system early. You do not need autonomous swarms, optimization loops, 15 subagents, or self-improving architecture in week 1. That becomes building infrastructure instead of game — a very common failure mode.

Initial setup should be minimal:

| Role | Performer |
|------|-----------|
| Vision | Human |
| Orchestration | Orchestrator (me) |
| Coding | One Builder Agent |
| Review | One Reviewer Agent |

That is enough for quite a while. Add complexity only when the current setup demonstrably cannot keep up.

### The Orchestration Model

```
Human (Creative + Systems Director)
        ↓
Orchestrator (Technical Lead + Producer)
        ↓
Specialized Task Agents (Implementers)
        ↓
Codebase + Tests + Artifacts
```

### Human

Owns: vision, feel, priorities, aesthetics, product direction, approval.

Does NOT micromanage code.

### Orchestrator

Responsibilities: break goals into phases, maintain architecture consistency, detect bad abstractions, generate implementation plans, create agent prompts, review outputs, manage technical debt, coordinate subsystem evolution.

The orchestrator is a technical lead + producer — NOT a product owner, architect, creative director, or systems designer.

### Implementer Agents

Must NOT:
- Redefine architecture
- Redefine project philosophy
- Invent roadmap direction
- Introduce speculative abstractions
- Overengineer systems
- Make creative decisions
- Decide "what should we build"

Must operate with: narrowly scoped tasks, strict constraints, explicit deliverables, acceptance criteria.

Every agent task must use the task template in `docs/TASK_TEMPLATE.md`.

### Reviewer Agents

Review for: architecture alignment, scope validation, maintainability, performance awareness.

### Technical Explanation Requirement

Never accept code without explanation. Agents must provide:

- Architecture reasoning (why this approach)
- Tradeoffs considered (what was rejected and why)
- Performance implications
- Future extensibility notes

This catches nonsense early and builds institutional knowledge.

---

## Review Gate System

Nothing merges automatically. EVER.

```
Agent implements
      ↓
Orchestrator reviews
      ↓
Human playtests / evaluates
      ↓
Refactor if needed
      ↓
Merge
```

Agents optimize for task completion, not long-term coherence. Human review is the only guardrail.

---

## Development Rhythm

The ideal loop:

```
Human: "This flying still doesn't feel dreamy enough."
   ↓
Orchestrator: Identify likely causes
   (camera damping / horizon fog / acceleration curve)
   ↓
Agent: Implements targeted changes
   ↓
Human: Playtest
   ↓
Orchestrator: Analyze outcome + refine direction
```

Priorities do not drift. Current focus is always explicit in PROJECT_STATE.md. Everything else is secondary.

---

## Decision Records

All significant architecture decisions are recorded as ADRs in `docs/decisions/`. Each ADR captures: what was decided, why, what alternatives were rejected, and what the consequences are.

This prevents re-litigating settled decisions.

---

## Optimization Rules

- Deferred until systems stabilize
- Only after: rendering pipeline matures, terrain architecture solidifies
- Autonomous optimization (future): constrained, benchmarked, human-reviewed
- Optimization targets: terrain gen, chunk streaming, memory, geometry, CPU — NOT artistic direction, emotional feel, or visual identity

---

## Browser Awareness

Be aware of draw call limits, memory pressure, WebGL limits, shader compilation costs, procedural gen costs, and GC spikes — but do not prematurely optimize for them.
