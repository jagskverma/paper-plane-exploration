# GLB Asset Database Summary

> Generated: 2026-05-30
> Database: `docs/assets/glb-database.json` — 1051 entries, 0 parse errors

## Sources

| Source | Files |
|--------|-------|
| converted-oga | 306 |
| polypizza/buildings | 255 |
| polypizza/nature | 286 |
| polypizza/scenes | 191 |
| public | 13 |

**Total:** 1051 files, 557.3 MB

## Scale Distribution (bounding sphere radius)

| Range | Count | % |
|-------|-------|---|
| Tiny (< 0.5m) | 475 | 45% |
| Small (0.5-2m) | 355 | 33% |
| Medium (2-10m) | 116 | 11% |
| Large (10-50m) | 34 | 3% |
| Huge (50m+) | 71 | 6% |

## Category Breakdown

| Category | Count | % |
|----------|-------|---|
| unknown | 351 | 33% |
| structure | 187 | 17% |
| tree | 184 | 17% |
| rock | 118 | 11% |
| bush | 114 | 10% |
| prop | 59 | 5% |
| vehicle | 16 | 1% |
| landmark | 12 | 1% |
| scene | 10 | 0% |

## Trees (top 15 by height)

| Height | Radius | Filename | Suggested Scale |
|--------|--------|----------|-----------------|
| 9.9m | 5.0m | Pine_79gmlLnweB.glb | 0.30x |
| 11.5m | 5.7m | Dead_Tree_Mcd2zYqyww.glb | 0.26x |
| 12.8m | 6.4m | Dead_Tree_n8FhMgMldD.glb | 0.23x |
| 13.3m | 6.6m | Dead_Tree_oM95bD8buf.glb | 0.23x |
| 13.8m | 6.9m | Tree_uxSb2WTPU4.glb | 0.22x |
| 14.2m | 7.1m | Queen_Palm_Tree_ficLBIjGliK.glb | 0.21x |
| 14.6m | 7.3m | Twisted_Tree_edSPJNECM7.glb | 0.21x |
| 15.0m | 7.5m | Twisted_Tree_8oraKn9m0x.glb | 0.20x |
| 15.5m | 7.7m | Twisted_Tree_9aWlx82xUf.glb | 0.19x |
| 16.4m | 8.2m | Dead_Tree_CD4edbPSGm.glb | 0.18x |
| 17.6m | 8.8m | Twisted_Tree_7PDBpElkQr.glb | 0.17x |
| 17.8m | 8.9m | Twisted_Tree_GVTsMmuzv7.glb | 0.17x |
| 38.9m | 55.1m | Trees_dTy_L-TMS2z.glb | 0.08x |
| 509.1m | 254.5m | Tree_6pwiq7hSrHr.glb | 0.01x |
| 509.1m | 254.5m | tree.glb | 0.01x |

## Rocks (top 10 by height)

| Height | Radius | Filename | Suggested Scale |
|--------|--------|----------|-----------------|
| 1.5m | 1.3m | Rock1.glb | 2.00x |
| 1.6m | 0.8m | Rock_dmRuyy1VXEv.glb | 1.91x |
| 1.9m | 1.5m | Rock_Medium_KZdEP3uUpa.glb | 1.58x |
| 2.0m | 1.7m | Rock_fM90QFMNtS.glb | 1.48x |
| 2.0m | 1.0m | ModularStoneWall.glb | 1.47x |
| 2.0m | 1.0m | WallRocks.glb | 1.47x |
| 2.1m | 1.3m | Rock3.glb | 1.43x |
| 2.3m | 1.6m | Rock_Medium_s1OJ3bBzqc.glb | 1.33x |
| 2.3m | 1.1m | ModularStoneWall_top.glb | 1.32x |
| 2.3m | 1.7m | Rock_Medium_JQxF95498B.glb | 1.29x |

## Target Scale Normalization

All objects are normalized to **3.0m target height**. The `suggestedScale` field shows the multiplier needed. Apply this scale when placing objects in the scene.

## Features

| Feature | Files with |
|---------|-----------|
| Normals | 1021 |
| Colors | 45 |
| UVs | 656 |
| Multi-mesh | 207 |
| Multi-material | 658 |

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
