# Scenery Curation Notes

> Generated: 2026-05-30

## Selection Philosophy

Every asset was chosen for **paper-plane readability** — distinct silhouettes visible from below and to the sides at 12m AGL. We prioritized low-poly models with simple shapes over detailed ones. The goal is a sparse, atmospheric world, not a dense simulation.

## Set Design Rationale

### starter-woodland (11 assets)

- 5 trees: 2 pine variants (silhouette), 1 birch (contrast), 1 maple (variety), 1 dead (atmosphere). This gives enough variety to avoid visible repetition without requiring many assets.
- 3 bushes/grass: Ground detail that's safe to fly over. No collision needed for grass.
- 3 rocks: Common scatter with one large variant for terrain accents.

### paper-plane-landmarks (6 assets)

- Castle, lighthouse, gazebo, wind turbine, watchtower, fantasy ruins.
- All have strong silhouettes visible at range. Castle and gazebo support fly-around/fly-through play.
- Placed hundreds of meters apart — each should feel like a discovery.

### settlement-sparse (5 assets)

- Farmhouse, house, hut, shed, barn. Rural/medieval feel consistent with low-poly atmospheric world.
- Intended for clusters of 3-5 buildings, not dense villages. Place near woodland edges.

## What Was Rejected

- **Modern buildings** (skyscrapers, apartments, city blocks): Wrong aesthetic for atmospheric low-poly exploration. Would break immersion.
- **Vehicles** (cars, trucks, buses): Modern and not useful at paper-plane scale. A boat might be reconsidered for water landmarks in Phase 10.
- **Sci-fi assets** (spaceships, tron cityscapes): Wrong tone.
- **Tiny props** (crates, barrels, furniture): Useful later but not for Phase 7 scenery. Keep in catalog for reference.
- **Duplicate variants**: Where an asset had 5+ near-identical variations, we picked 2 max.

## Notes for Codex

- All selected assets exist as single `.glb` files in `assets/polypizza/`. No extraction needed.
- Asset IDs in the manifest match `docs/references/asset-curation/asset-catalog.json` IDs.
- Scale hints are relative to the source model's natural size. Models vary — the pine tree GLB is a different scale than the rock GLB.
- `collisionHint: trunk_canopy` means: add a thin trunk capsule plus a canopy sphere. The starter woodland runtime catalog now uses this approximation.
- `frequency` is a placement guideline, not a hard count. `common` = many, `uncommon` = some, `rare` = few.
