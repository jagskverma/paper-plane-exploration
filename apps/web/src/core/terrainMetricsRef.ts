export interface TerrainDebugMetrics {
  visibleChunks: number;
  generatedChunks: number;
  cacheEntries: number;
  approximateVertices: number;
  sceneryObjects?: number;
}

export const terrainMetricsRef: { current: TerrainDebugMetrics | null } = {
  current: null,
};
