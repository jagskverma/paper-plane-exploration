# Objective

Create a curated manifest of assets recommended for Phase 7 procedural scenery.

# Why

The catalog can still be too broad. Codex needs a small manifest with specific recommended assets and intended use, so procedural placement can expand without arbitrary choices.

# Constraints

- Documentation/data only.
- Do not copy assets.
- Do not modify app code.
- Use only assets listed in `docs/assets/asset-catalog.json`.
- Keep the first curated set small and browser-friendly.

# Existing Context

- `docs/assets/asset-catalog.json` from Task 01.
- Visual target: atmospheric low-poly paper-plane exploration.
- Flight target: low altitude, between trees and terrain objects.

# Deliverables

Create:

- `docs/assets/scenery-curation-manifest.json`
- `docs/assets/scenery-curation-notes.md`

# Required JSON Schema

`scenery-curation-manifest.json` must be:

```json
{
  "version": 1,
  "sets": [
    {
      "id": "starter-woodland",
      "description": "Low-density trees, bushes, and rocks for Phase 7.",
      "assets": [
        {
          "assetId": "from-asset-catalog",
          "role": "canopy_tree | pine_tree | bush | rock | landmark | structure",
          "frequency": "common | uncommon | rare",
          "scaleHint": {
            "min": 1,
            "max": 1
          },
          "collisionHint": "trunk_canopy | sphere | none",
          "placementHint": "open_ground | ridge | near_trees | rare_landmark",
          "notes": "short reason this asset was selected"
        }
      ]
    }
  ]
}
```

# Required Sets

Create these sets:

1. `starter-woodland`
   - 3-5 tree assets
   - 2-4 bush/shrub assets
   - 3-5 rock assets

2. `paper-plane-landmarks`
   - 5-8 rare landmarks or structures that would be interesting to fly around or through
   - prioritize arches, towers, bridges, barns, lighthouses, ruins, windmill-like shapes if present

3. `settlement-sparse`
   - 5-8 houses/barns/sheds/fences/towers
   - intended for rare clusters, not dense cities

# Selection Criteria

Prioritize assets that are:

- low-poly
- readable from behind a paper plane
- simple silhouettes
- likely small enough for browser use
- relevant to flying between/around objects
- not visually modern-city-heavy unless selected as rare landmarks

# Acceptance Criteria

- Manifest references only IDs that exist in `asset-catalog.json`.
- Every selected asset has a reason.
- Notes explain why assets were rejected or avoided if relevant.
- The manifest is small enough that Codex can copy selected assets manually into `apps/web/public/`.

# Non-Goals

- No procedural placement code.
- No copying assets.
- No optimizing assets.
- No collision implementation.

