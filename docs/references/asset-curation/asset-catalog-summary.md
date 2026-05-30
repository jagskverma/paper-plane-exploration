# Asset Catalog Summary

> Generated: 2026-05-30  
> Source: `assets/polypizza/nature/` (286 .glb files) + `assets/polypizza/buildings/` (255 .glb files)  
> Catalog: `docs/references/asset-curation/asset-catalog.json` — 22 curated candidates referenced by `docs/references/asset-curation/scenery-curation-manifest.json`

## Sources Scanned

| Source | Total .glb | Selected | Categories |
|--------|-----------|----------|------------|
| `polypizza/nature` | 286 | 11 | trees, bushes, rocks, grass |
| `polypizza/buildings` | 255 | 11 | structures, landmarks |
| **Total** | **541** | **22** | |

## Category Breakdown (Selected)

| Category | Count | Notes |
|----------|-------|-------|
| tree | 5 | Conifers, broadleaf, dead trees. Diverse silhouettes. |
| bush | 2 | Bushes and flowers. Small ground detail. |
| grass | 1 | Ground detail with no collision. |
| rock | 3 | Standard rocks plus one large boulder. |
| structure | 5 | Houses, barns, sheds, huts. Paper-plane readable. |
| landmark | 6 | Castle, lighthouse, wind turbine, watchtower, arch/gazebo. |

## Most Promising Sources

- **Nature > trees**: Excellent variety — pines, birches, maples, palms, all low-poly. The `Pine_Trees`, `Birch_Trees`, `Maple_Trees` variants are the strongest candidates for woodland scenery.
- **Nature > rocks**: Good size range from pebbles to boulders. `Rock_Large` variants work for landmarks.
- **Buildings > structures**: `Farm_house`, `Gazebo`, `Watch_Tower`, `Lighthouse`, `Windmill` are ideal for paper-plane landmarks.
- **Buildings > castle/ruins**: `Castle_1234` and `Fantasy_Ruins` are large landmark candidates.

## Notable Gaps

- **Water/coast assets**: No beach, dock, or pier models in the catalog. Acknowledged gap — water is Phase 10.
- **Path/walkway assets**: No paths or trails. Roads exist in buildings but are modern-style.
- **Flying obstacles**: No arches specifically designed for fly-through. `Gazebo` and `Arch` can serve this role.
- **Paper-plane-scale props**: Most props are modern (fire hydrants, traffic lights). Skipped for now.

## File Sizes

The runtime starter woodland slice currently copies 9 assets into `apps/web/public/scenery-assets/`. The remaining landmark and settlement candidates stay as source references until placement rules exist.
