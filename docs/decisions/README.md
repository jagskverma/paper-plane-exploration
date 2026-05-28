# Architecture Decision Records

This directory records all significant architecture decisions for the project. Each ADR captures: what was decided, why, what alternatives were rejected, and the consequences.

## Format

- Files are numbered sequentially: `NNN-short-title.md`
- Once merged, ADRs are immutable (add a new ADR to supersede, don't edit)
- Each ADR is a single decision, not a collection

## Template

```markdown
# ADR-NNN: Title

Date: YYYY-MM-DD
Status: proposed | accepted | deprecated | superseded by ADR-XXX

## Context
What is the issue that's motivating this decision?

## Decision
What is the change we're proposing and/or doing?

## Alternatives Considered
What other options were considered? Why weren't they chosen?

## Consequences
What becomes easier or harder because of this decision?
```

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [001](001-cube-sphere-topology.md) | Cube-sphere planet topology | accepted |
