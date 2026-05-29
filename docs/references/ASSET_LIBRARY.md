# Asset Library

Local asset source: `assets/`

These assets are available for future phases. Do not bulk-import them into the web app. Select, inspect, optimize, and copy only the specific assets needed for a task.

## Inventory

| Source | Approx Count | Approx Size | Notes |
|--------|--------------|-------------|-------|
| Kenney | 25 packs | 88 MB | `.fbx` / `.glb` zips covering game kits, nature, cities |
| Poly Pizza Buildings | 255 models | 105 MB | `.glb` buildings, castles, bridges, houses |
| Poly Pizza Nature | 286 models | 145 MB | `.glb` trees, rocks, grass, planets |
| OpenGameArt | 98 packs | 832 MB | `.blend` / `.zip` terrain, dungeons, props, nature |
| Quaternius | 1 available pack | 7 MB | `.blend`; Google Drive blocked the other 25 during download |

Observed local directories:

- `assets/kenney`
- `assets/opengameart`
- `assets/polypizza/buildings`
- `assets/polypizza/nature`
- `assets/quaternius`

## Usage Rules

- Prefer low-poly `.glb` assets for browser runtime use.
- Treat `.blend`, `.fbx`, and zipped packs as source assets requiring conversion or inspection before runtime use.
- Keep runtime assets small and curated under `apps/web/public/` or a future asset pipeline directory.
- Do not load from `assets/` directly in the browser app.
- Do not introduce a general asset-management system before we have concrete placement and culling needs.
- Document every selected asset source when copying it into the app.

## Best Early Candidates

For Phase 5.5 scale testing, use only a few simple assets:

- 1-2 low-poly trees from `assets/polypizza/nature`
- 1 rock or shrub from `assets/polypizza/nature`
- optional simple house/fence/object from `assets/polypizza/buildings` only if needed for scale contrast

The goal is not content breadth. The goal is to validate whether flying low between objects feels like a real paper plane.
