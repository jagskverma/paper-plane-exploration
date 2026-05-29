# Phase 5.5 — Unused Asset Cleanup Proposal

> Generated: 2026-05-29

## Current Public Assets

| Path | Size | Referenced? | Used By |
|------|------|-------------|---------|
| `public/paper-plane.glb` | 2.1 KB | ❌ No | Nothing — code uses procedural `PlaneModel.tsx` |
| `public/scale-test-assets/tree.glb` | — | ✅ Yes | `ScaleTestPlacements.ts` + `ScaleTestObjects.tsx` |
| `public/scale-test-assets/pine-tree.glb` | — | ✅ Yes | `ScaleTestPlacements.ts` + `ScaleTestObjects.tsx` |
| `public/scale-test-assets/small-rock.glb` | — | ✅ Yes | `ScaleTestPlacements.ts` + `ScaleTestObjects.tsx` |
| `public/scale-test-assets/bush.glb` | — | ✅ Yes | `ScaleTestPlacements.ts` + `ScaleTestObjects.tsx` |

## Findings

1. **`paper-plane.glb` is completely unused.** The procedural `PlaneModel.tsx` was reverted to built-in geometry (5 triangles with paper material). No code imports or references the GLB.

2. **All scale-test assets are actively used** by the object placement system.

3. **Earlier plane models (`jet.glb`, `paper_airplane2.glb`, `Paper Plane.glb`) are not in public/.** They were replaced during Phase 5.5 and are gone.

## Recommendation

| Action | File | Reason |
|--------|------|--------|
| **Safe to remove now** | `public/paper-plane.glb` | No code references. Procedural model is the permanent replacement. |
| **Keep** | `public/scale-test-assets/*` | Actively used by Phase 5.5 scale tests. |
| **Consider removing later** | Scale test assets in Phase 6+ | Replace with proper biome-placed assets from the asset library. |

## Cleanup Command

```bash
rm apps/web/public/paper-plane.glb
```

One file. No code changes needed.
