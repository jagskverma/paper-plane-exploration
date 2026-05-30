# Runtime Asset Swap Guide

> Date: 2026-05-30

## Goal

Make scenery asset swapping explicit and low-risk.

## Runtime Files

- Runtime GLBs live under `apps/web/public/scenery-assets/`.
- Runtime catalog lives in `apps/web/src/world/SceneryCatalog.ts`.
- Active scenery is controlled by `ACTIVE_SCENERY_ASSET_IDS`.
- Scale review is available at `http://127.0.0.1:5174/?scaleReview=1`.

## Add A New Asset

1. Copy the `.glb` into `apps/web/public/scenery-assets/` or a subfolder.
2. Add an entry to `SCENERY_ASSET_LIBRARY`.
3. Add the new `id` to `ACTIVE_SCENERY_ASSET_IDS`.
4. Run `pnpm lint` and `pnpm build` from `apps/web`.
5. Open `/?scaleReview=1` and tune scale.

## Remove An Active Asset

1. Remove its `id` from `ACTIVE_SCENERY_ASSET_IDS`.
2. Leave the library entry in place unless the asset should never be used again.
3. Run `pnpm lint` and `pnpm build`.

## Current Active Set

The current active set is the converted SimpleNature pack:

- `simple-tree-1`
- `simple-tree-2`
- `simple-tree-3`
- `simple-tree-4`
- `simple-bush-1`
- `simple-bush-2`
- `simple-bush-3`
- `simple-grass-1`
- `simple-grass-2`
- `simple-grass-3`
- `simple-rock-1`
- `simple-rock-2`
- `simple-rock-3`

The previous Poly Pizza starter set remains in the catalog library and can be reactivated by changing `ACTIVE_SCENERY_ASSET_IDS`.
