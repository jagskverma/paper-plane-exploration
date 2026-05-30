# Objective

Create a precise runtime copy plan for the curated scenery assets.

# Why

The browser app should not load directly from `assets/`. We need a controlled list of files to copy into `apps/web/public/` when Codex wires the curated manifest into runtime.

# Constraints

- Documentation only.
- Do not copy files.
- Do not rename source files.
- Do not modify app code.
- Keep the first copy plan small.

# Existing Context

- `docs/assets/scenery-curation-manifest.json`
- Existing runtime folder: `apps/web/public/scale-test-assets/`

# Deliverables

Create:

- `docs/assets/runtime-copy-plan.md`
- `docs/assets/runtime-copy-plan.json`

# Required JSON Schema

```json
[
  {
    "assetId": "from-manifest",
    "sourcePath": "assets/...",
    "targetPath": "apps/web/public/scenery/starter-woodland/example.glb",
    "reason": "Used as common pine tree in starter woodland."
  }
]
```

# Copy Plan Rules

- Target folder should be `apps/web/public/scenery/`.
- Group by curated set:
  - `starter-woodland`
  - `paper-plane-landmarks`
  - `settlement-sparse`
- Use simple kebab-case target filenames.
- Include only the curated assets needed for the first runtime pass.
- Avoid duplicates where the same asset appears in multiple sets; choose one target path and note reuse.

# Acceptance Criteria

- Every source path exists.
- Every target path is under `apps/web/public/scenery/`.
- No file copy is performed.
- Plan is directly executable by Codex later.

# Non-Goals

- No asset compression.
- No GLB validation.
- No image generation.
- No runtime code.

