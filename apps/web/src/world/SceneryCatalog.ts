// Scale values verified from GLB database (accessor min/max).
// Split trees are tiny after Blender export — need large scale factors.
// User will visually verify and flag any that look wrong.

export type SceneryRole =
  | "pine_tree"
  | "canopy_tree"
  | "bush"
  | "grass"
  | "rock";

export type SceneryCollisionHint = "trunk_canopy" | "sphere" | "none";

export interface SceneryAssetDefinition {
  id: string;
  url: string;
  role: SceneryRole;
  weight: number;
  scaleMin: number;
  scaleMax: number;
  collisionHint: SceneryCollisionHint;
  collisionHeight: number;
  collisionRadius: number;
}

const SCENERY_ASSET_LIBRARY: SceneryAssetDefinition[] = [
  // ======== SimpleNature (heights verified from GLB DB) ========
  // Tree1: 2.41m native → scale 1.2-1.7x for ~3-4m target
  {
    id: "simple-tree-1",
    url: "/scenery-assets/simplenature/Tree1.glb",
    role: "canopy_tree",
    weight: 20,
    scaleMin: 1.2,
    scaleMax: 1.7,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.8,
    collisionRadius: 0.9,
  },
  // Tree2: 1.70m native → scale 1.7-2.4x
  {
    id: "simple-tree-2",
    url: "/scenery-assets/simplenature/Tree2.glb",
    role: "canopy_tree",
    weight: 18,
    scaleMin: 1.7,
    scaleMax: 2.4,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.8,
    collisionRadius: 0.9,
  },
  // Tree3: 2.21m native → scale 1.3-1.8x (pine silhouette)
  {
    id: "simple-tree-3",
    url: "/scenery-assets/simplenature/Tree3.glb",
    role: "pine_tree",
    weight: 18,
    scaleMin: 1.3,
    scaleMax: 1.8,
    collisionHint: "trunk_canopy",
    collisionHeight: 3.0,
    collisionRadius: 0.9,
  },
  // Tree4: 5.57m native → scale 0.5-0.8x (too big, shrink)
  {
    id: "simple-tree-4",
    url: "/scenery-assets/simplenature/Tree4.glb",
    role: "pine_tree",
    weight: 16,
    scaleMin: 0.5,
    scaleMax: 0.8,
    collisionHint: "trunk_canopy",
    collisionHeight: 3.0,
    collisionRadius: 0.9,
  },
  // ======== SimpleNature bushes (heights: 0.59-0.99m → scale to ~1.5m) ========
  {
    id: "simple-bush-1",
    url: "/scenery-assets/simplenature/Bush1.glb",
    role: "bush",
    weight: 10,
    scaleMin: 2.8,
    scaleMax: 3.5,
    collisionHint: "sphere",
    collisionHeight: 0.8,
    collisionRadius: 0.7,
  },
  {
    id: "simple-bush-2",
    url: "/scenery-assets/simplenature/Bush2.glb",
    role: "bush",
    weight: 10,
    scaleMin: 4.5,
    scaleMax: 5.5,
    collisionHint: "sphere",
    collisionHeight: 0.8,
    collisionRadius: 0.7,
  },
  {
    id: "simple-bush-3",
    url: "/scenery-assets/simplenature/Bush3.glb",
    role: "bush",
    weight: 8,
    scaleMin: 3.5,
    scaleMax: 4.5,
    collisionHint: "sphere",
    collisionHeight: 0.7,
    collisionRadius: 0.65,
  },
  // ======== SimpleNature grass (heights: 0.21-0.33m → scale to ~1m) ========
  {
    id: "simple-grass-1",
    url: "/scenery-assets/simplenature/Grass1.glb",
    role: "grass",
    weight: 8,
    scaleMin: 12,
    scaleMax: 16,
    collisionHint: "none",
    collisionHeight: 0.5,
    collisionRadius: 0,
  },
  {
    id: "simple-grass-2",
    url: "/scenery-assets/simplenature/Grass2.glb",
    role: "grass",
    weight: 8,
    scaleMin: 11,
    scaleMax: 15,
    collisionHint: "none",
    collisionHeight: 0.5,
    collisionRadius: 0,
  },
  {
    id: "simple-grass-3",
    url: "/scenery-assets/simplenature/Grass3.glb",
    role: "grass",
    weight: 8,
    scaleMin: 8,
    scaleMax: 11,
    collisionHint: "none",
    collisionHeight: 0.5,
    collisionRadius: 0,
  },
  // ======== SimpleNature rocks (heights: 1.07-2.09m → scale to ~2m) ========
  {
    id: "simple-rock-1",
    url: "/scenery-assets/simplenature/Rock1.glb",
    role: "rock",
    weight: 6,
    scaleMin: 1.8,
    scaleMax: 2.5,
    collisionHint: "sphere",
    collisionHeight: 0.7,
    collisionRadius: 0.8,
  },
  {
    id: "simple-rock-2",
    url: "/scenery-assets/simplenature/Rock2.glb",
    role: "rock",
    weight: 6,
    scaleMin: 2.5,
    scaleMax: 3.5,
    collisionHint: "sphere",
    collisionHeight: 0.7,
    collisionRadius: 0.8,
  },
  {
    id: "simple-rock-3",
    url: "/scenery-assets/simplenature/Rock3.glb",
    role: "rock",
    weight: 4,
    scaleMin: 1.2,
    scaleMax: 1.8,
    collisionHint: "sphere",
    collisionHeight: 0.8,
    collisionRadius: 0.9,
  },
  // ======== Split single trees (tiny after Blender export — large scale) ========
  // Birch: ~0.01-0.03m native, target ~3.5m → ~100-150x
  {
    id: "birch-1",
    url: "/scenery-assets/BirchTree_1.glb",
    role: "canopy_tree",
    weight: 12,
    scaleMin: 9,
    scaleMax: 15,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.4,
    collisionRadius: 0.9,
  },
  {
    id: "birch-2",
    url: "/scenery-assets/BirchTree_2.glb",
    role: "canopy_tree",
    weight: 10,
    scaleMin: 9,
    scaleMax: 15,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.4,
    collisionRadius: 0.9,
  },
  {
    id: "birch-3",
    url: "/scenery-assets/BirchTree_3.glb",
    role: "canopy_tree",
    weight: 8,
    scaleMin: 9,
    scaleMax: 15,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.4,
    collisionRadius: 0.9,
  },
  // Pine: ~0.01m native, target ~4.5m → ~120-195x
  {
    id: "pine-1",
    url: "/scenery-assets/PineTree_1.glb",
    role: "pine_tree",
    weight: 12,
    scaleMin: 12,
    scaleMax: 20,
    collisionHint: "trunk_canopy",
    collisionHeight: 3.1,
    collisionRadius: 1.1,
  },
  {
    id: "pine-2",
    url: "/scenery-assets/PineTree_2.glb",
    role: "pine_tree",
    weight: 10,
    scaleMin: 12,
    scaleMax: 20,
    collisionHint: "trunk_canopy",
    collisionHeight: 3.1,
    collisionRadius: 1.1,
  },
  {
    id: "pine-3",
    url: "/scenery-assets/PineTree_3.glb",
    role: "pine_tree",
    weight: 8,
    scaleMin: 12,
    scaleMax: 20,
    collisionHint: "trunk_canopy",
    collisionHeight: 3.1,
    collisionRadius: 1.1,
  },
  // Maple: ~0.03-0.06m native, target ~3m → ~80-130x
  {
    id: "maple-1",
    url: "/scenery-assets/MapleTree_1.glb",
    role: "canopy_tree",
    weight: 10,
    scaleMin: 8,
    scaleMax: 13,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.1,
    collisionRadius: 0.8,
  },
  {
    id: "maple-2",
    url: "/scenery-assets/MapleTree_2.glb",
    role: "canopy_tree",
    weight: 8,
    scaleMin: 8,
    scaleMax: 13,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.1,
    collisionRadius: 0.8,
  },
  {
    id: "maple-3",
    url: "/scenery-assets/MapleTree_3.glb",
    role: "canopy_tree",
    weight: 6,
    scaleMin: 8,
    scaleMax: 13,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.1,
    collisionRadius: 0.8,
  },
  // Dead: ~0.01-0.04m native, target ~3m → ~80-130x
  {
    id: "dead-1",
    url: "/scenery-assets/DeadTree_1.glb",
    role: "canopy_tree",
    weight: 5,
    scaleMin: 8,
    scaleMax: 13,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.1,
    collisionRadius: 0.8,
  },
  {
    id: "dead-2",
    url: "/scenery-assets/DeadTree_2.glb",
    role: "canopy_tree",
    weight: 4,
    scaleMin: 8,
    scaleMax: 13,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.1,
    collisionRadius: 0.8,
  },
  {
    id: "dead-3",
    url: "/scenery-assets/DeadTree_3.glb",
    role: "canopy_tree",
    weight: 3,
    scaleMin: 8,
    scaleMax: 13,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.1,
    collisionRadius: 0.8,
  },
  // Normal: ~0.01-0.04m native, target ~3.5m → ~90-150x
  {
    id: "normal-1",
    url: "/scenery-assets/NormalTree_1.glb",
    role: "canopy_tree",
    weight: 10,
    scaleMin: 9,
    scaleMax: 15,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.4,
    collisionRadius: 0.9,
  },
  {
    id: "normal-2",
    url: "/scenery-assets/NormalTree_2.glb",
    role: "canopy_tree",
    weight: 8,
    scaleMin: 9,
    scaleMax: 15,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.4,
    collisionRadius: 0.9,
  },
  {
    id: "normal-3",
    url: "/scenery-assets/NormalTree_3.glb",
    role: "canopy_tree",
    weight: 6,
    scaleMin: 9,
    scaleMax: 15,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.4,
    collisionRadius: 0.9,
  },
  // Palm: ~0.00-0.02m native, target ~4m → ~105-175x
  {
    id: "palm-1",
    url: "/scenery-assets/PalmTree_1.glb",
    role: "pine_tree",
    weight: 6,
    scaleMin: 11,
    scaleMax: 17,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.8,
    collisionRadius: 1.0,
  },
  {
    id: "palm-2",
    url: "/scenery-assets/PalmTree_2.glb",
    role: "pine_tree",
    weight: 4,
    scaleMin: 11,
    scaleMax: 17,
    collisionHint: "trunk_canopy",
    collisionHeight: 2.8,
    collisionRadius: 1.0,
  },
  // SmallTree: 2.78m native → scale 1.0-1.5x (only split tree at reasonable scale)
  {
    id: "small-1",
    url: "/scenery-assets/SmallTree_01.glb",
    role: "canopy_tree",
    weight: 10,
    scaleMin: 1.0,
    scaleMax: 1.5,
    collisionHint: "trunk_canopy",
    collisionHeight: 1.5,
    collisionRadius: 0.5,
  },
  {
    id: "small-2",
    url: "/scenery-assets/SmallTree_02.glb",
    role: "canopy_tree",
    weight: 8,
    scaleMin: 1.0,
    scaleMax: 1.5,
    collisionHint: "trunk_canopy",
    collisionHeight: 1.5,
    collisionRadius: 0.5,
  },
];

export const ACTIVE_SCENERY_ASSET_IDS = [
  "simple-tree-1", "simple-tree-2", "simple-tree-3", "simple-tree-4",
  "small-1", "small-2",
  "simple-bush-1", "simple-bush-2", "simple-bush-3",
  "simple-grass-1", "simple-grass-2", "simple-grass-3",
  "simple-rock-1", "simple-rock-2", "simple-rock-3",
  "birch-1", "birch-2", "birch-3",
  "pine-1", "pine-2", "pine-3",
  "maple-1", "maple-2", "maple-3",
  "dead-1", "dead-2", "dead-3",
  "normal-1", "normal-2", "normal-3",
  "palm-1", "palm-2",
] as const;

export const STARTER_WOODLAND_SCENERY = ACTIVE_SCENERY_ASSET_IDS.map((assetId) => {
  const asset = SCENERY_ASSET_LIBRARY.find((candidate) => candidate.id === assetId);
  if (!asset) {
    throw new Error(`Unknown active scenery asset: ${assetId}`);
  }
  return asset;
});
