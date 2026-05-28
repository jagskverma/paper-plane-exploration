# Rules & Constraints

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

No long infrastructure-only phases. No giant one-shot implementations.

### First Milestone Gate

Beautiful flight in atmospheric empty space. If this isn't achieved, terrain and content work does not begin.

## Forbidden Engineering Patterns

- Premature ECS (Entity Component System)
- Enterprise-style architecture
- Plugin systems
- Giant abstraction layers
- Speculative utility systems
- Hidden magic
- Excessive dependencies
- Uncontrolled global state

## Preferred Engineering Patterns

- Clarity over cleverness
- Maintainability over abstraction
- Iteration speed over premature optimization
- Explicitness over implicit behavior
- Composability over monolithic systems

## AI Agent Rules

### Implementer Agents

Must NOT:
- Redefine architecture
- Redefine project philosophy
- Invent roadmap direction
- Introduce speculative abstractions
- Overengineer systems

Must operate with: narrowly scoped tasks, strict constraints, explicit deliverables, acceptance criteria.

### Reviewer Agents

Review for: architecture alignment, scope validation, maintainability, performance awareness.

### Orchestrator

Governs: architecture, sequencing, task decomposition, technical oversight.

### Human

Owns: vision, emotional direction, approval of all significant decisions.

## Optimization Rules

- Deferred until systems stabilize
- Only after: rendering pipeline matures, terrain architecture solidifies
- Autonomous optimization (future): constrained, benchmarked, human-reviewed
- Optimization targets: terrain gen, chunk streaming, memory, geometry, CPU — NOT artistic direction, emotional feel, or visual identity

## Browser Awareness

Be aware of draw call limits, memory pressure, WebGL limits, shader compilation costs, procedural gen costs, and GC spikes — but do not prematurely optimize for them.
