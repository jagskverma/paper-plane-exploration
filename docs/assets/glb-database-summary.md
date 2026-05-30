# GLB Asset Database Summary

> Generated: 2026-05-30
> Database: `docs/assets/glb-database.json` — 4460 entries, 0 parse errors

## Sources

| Source | Files |
|--------|-------|
| converted-oga | 306 |
| polypizza/buildings | 255 |
| polypizza/nature | 286 |
| polypizza/scenes | 190 |
| public | 3002 |
| split-trees | 421 |

**Total:** 4460 files, 1349.1 MB

## Scale Distribution (bounding sphere radius)

| Range | Count | % |
|-------|-------|---|
| Tiny (< 0.5m) | 1959 | 43% |
| Small (0.5-2m) | 1754 | 39% |
| Medium (2-10m) | 366 | 8% |
| Large (10-50m) | 205 | 4% |
| Huge (50m+) | 176 | 3% |

## Category Breakdown

| Category | Count | % |
|----------|-------|---|
| unknown | 1646 | 36% |
| structure | 726 | 16% |
| tree | 627 | 14% |
| rock | 494 | 11% |
| bush | 460 | 10% |
| prop | 257 | 5% |
| vehicle | 205 | 4% |
| landmark | 24 | 0% |
| scene | 21 | 0% |

## Trees (top 15 by height)

| Height | Radius | Filename | Suggested Scale |
|--------|--------|----------|-----------------|
| 15.0m | 7.5m | Twisted_Tree_8oraKn9m0x.glb | 0.20x |
| 15.0m | 7.5m | Twisted_Tree_8oraKn9m0x.glb | 0.20x |
| 15.5m | 7.7m | Twisted_Tree_9aWlx82xUf.glb | 0.19x |
| 15.5m | 7.7m | Twisted_Tree_9aWlx82xUf.glb | 0.19x |
| 16.4m | 8.2m | Dead_Tree_CD4edbPSGm.glb | 0.18x |
| 16.4m | 8.2m | Dead_Tree_CD4edbPSGm.glb | 0.18x |
| 17.6m | 8.8m | Twisted_Tree_7PDBpElkQr.glb | 0.17x |
| 17.6m | 8.8m | Twisted_Tree_7PDBpElkQr.glb | 0.17x |
| 17.8m | 8.9m | Twisted_Tree_GVTsMmuzv7.glb | 0.17x |
| 17.8m | 8.9m | Twisted_Tree_GVTsMmuzv7.glb | 0.17x |
| 38.9m | 55.1m | Trees_dTy_L-TMS2z.glb | 0.08x |
| 38.9m | 55.1m | Trees_dTy_L-TMS2z.glb | 0.08x |
| 509.1m | 254.5m | Tree_6pwiq7hSrHr.glb | 0.01x |
| 509.1m | 254.5m | apps_web_public_scale-test-assets_tree.glb | 0.01x |
| 509.1m | 254.5m | Tree_6pwiq7hSrHr.glb | 0.01x |

## Rocks (top 10 by height)

| Height | Radius | Filename | Suggested Scale |
|--------|--------|----------|-----------------|
| 2.3m | 1.1m | ModularStoneWall_top.glb | 1.32x |
| 2.3m | 1.1m | ModularStoneWall_top.glb | 1.32x |
| 2.3m | 1.8m | rocks-c.glb | 1.30x |
| 2.3m | 1.7m | Rock_Medium_JQxF95498B.glb | 1.29x |
| 2.3m | 1.7m | Rock_Medium_JQxF95498B.glb | 1.29x |
| 2.6m | 1.9m | rocks-sand-c.glb | 1.15x |
| 2.9m | 2.6m | rocks-a.glb | 1.03x |
| 3.2m | 2.6m | rocks-sand-a.glb | 0.93x |
| 3.7m | 2.4m | rocks-b.glb | 0.82x |
| 3.7m | 2.4m | rocks-sand-b.glb | 0.81x |

## Target Scale Normalization

All objects are normalized to **3.0m target height**. The `suggestedScale` field shows the multiplier needed. Apply this scale when placing objects in the scene.

## Features

| Feature | Files with |
|---------|-----------|
| Normals | 4401 |
| Colors | 106 |
| UVs | 3642 |
| Multi-mesh | 493 |
| Multi-material | 2220 |

## Query Examples

```python
import json
with open("docs/assets/glb-database.json") as f:
    db = json.load(f)

# All trees sorted by height
trees = sorted([e for e in db if e["category"] == "tree"], key=lambda x: -x["height"])

# Find rocks between 1-2m radius
medium_rocks = [e for e in db if e["category"] == "rock" and 1 <= e["radius"] <= 2]

# Assets needing most scale adjustment
needs_scaling = sorted(db, key=lambda x: abs(1.0 - x["suggestedScale"]), reverse=True)[:20]
```
