# Objective

Create a searchable local catalog of useful `.glb` assets for Phase 7 procedural scenery.

# Why

The repository has a large local asset library. Codex should not repeatedly parse thousands of files while implementing procedural placement. A compact catalog lets us select assets quickly and deliberately.

# Constraints

- Documentation/data only.
- Do not copy assets into `apps/web/public`.
- Do not modify app code.
- Prefer `.glb` files.
- Do not inspect or convert `.blend`, `.fbx`, or `.zip` files unless needed for a short note.
- Keep the catalog focused on assets plausibly useful for a low-poly paper-plane world.

# Existing Context

- Asset root: `assets/`
- Asset inventory doc: `docs/references/ASSET_LIBRARY.md`
- Current runtime assets:
  - `apps/web/public/scale-test-assets/tree.glb`
  - `apps/web/public/scale-test-assets/pine-tree.glb`
  - `apps/web/public/scale-test-assets/small-rock.glb`
  - `apps/web/public/scale-test-assets/bush.glb`

# Deliverables

Create:

- `docs/assets/asset-catalog.json`
- `docs/assets/asset-catalog-summary.md`

# Required JSON Schema

`asset-catalog.json` must be an array of objects:

```json
[
  {
    "id": "stable-kebab-case-id",
    "source": "polypizza/nature",
    "path": "assets/polypizza/nature/Example.glb",
    "filename": "Example.glb",
    "category": "tree | bush | rock | grass | structure | landmark | prop | unknown",
    "tags": ["lowpoly", "tree", "conifer"],
    "fileSizeBytes": 12345,
    "notes": "short note"
  }
]
```

# Catalog Scope

Catalog at least:

- 25 tree candidates
- 10 bush/shrub/grass candidates
- 15 rock/cliff/stone candidates
- 10 small structure candidates
- 10 landmark candidates

If a category has fewer usable assets, document that explicitly.

# Categorization Rules

- `tree`: trees, palms, conifers, stylized trunks/canopies.
- `bush`: bushes, shrubs, grass clumps, flowers.
- `rock`: rocks, boulders, cliffs, stone piles.
- `structure`: houses, barns, sheds, towers, bridges, fences, ruins.
- `landmark`: visually distinct large or rare objects, e.g. lighthouse, tower, arch, ferris wheel.
- `prop`: small non-natural objects that could appear near structures.
- `unknown`: only if filename is ambiguous.

# Acceptance Criteria

- JSON is valid.
- Paths are relative to repo root.
- Every catalog entry points to an existing file.
- Catalog is small enough to be useful; do not catalog every asset.
- Summary explains the most promising sources and any obvious gaps.

# Non-Goals

- No runtime asset loading.
- No copying to public.
- No model conversion.
- No screenshots required.
- No collision setup.

