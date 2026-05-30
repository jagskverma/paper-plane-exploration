export interface TerrainDebugMetrics {
  visibleChunks: number;
  generatedChunks: number;
  cacheEntries: number;
  approximateVertices: number;
  activeSceneryChunks?: number;
  sceneryObjects?: number;
  collidableSceneryObjects?: number;
  activeSceneryAssetTypes?: number;
}

export const terrainMetricsRef: { current: TerrainDebugMetrics | null } = {
  current: null,
};
