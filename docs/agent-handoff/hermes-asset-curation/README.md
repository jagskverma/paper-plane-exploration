# Hermes Asset Curation Handoff

This handoff is for creating a deterministic asset catalog and curated runtime manifest for procedural scenery.

## Why This Exists

The game currently uses a few ad hoc assets from `assets/polypizza/nature`. That was acceptable for Phase 5.5 scale tests, but Phase 7 procedural scenery needs intentional asset selection:

- paper-plane-scale trees
- rocks and bushes
- occasional landmarks
- sparse buildings/structures only where they support traversal

The goal is not to import many assets. The goal is to make a small, well-documented candidate set that Codex can wire into procedural placement without repeatedly scanning the 1.1 GB asset library.

## Agent Instructions

- Read `AGENTS.md`, `docs/VISION.md`, `docs/ROADMAP.md`, `docs/PROJECT_STATE.md`, and `docs/references/ASSET_LIBRARY.md`.
- Work on tasks in filename order.
- Prefer `.glb` assets already available locally.
- Do not bulk-copy assets into `apps/web/public`.
- Do not modify runtime code unless a task explicitly asks for a tiny validation script. These tasks are documentation/catalog tasks.
- Do not add dependencies.
- Do not alter existing Phase 7 terrain/scenery code.
- Use deterministic file formats: Markdown and JSON.
- Keep output compact enough for Codex to read quickly.

## Suggested Order

1. `01-asset-inventory-catalog.md`
2. `02-scenery-curation-manifest.md`
3. `03-runtime-copy-plan.md`
4. `04-placement-taxonomy.md`

