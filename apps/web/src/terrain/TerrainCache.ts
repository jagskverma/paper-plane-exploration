import type * as THREE from "three";
import type { ChunkId } from "./ChunkId";
import { chunkKey } from "./ChunkId";

const DEFAULT_MAX_ENTRIES = 2048;

export class TerrainCache {
  private geometries = new Map<string, THREE.BufferGeometry>();
  private insertionOrder: string[] = [];
  private maxEntries: number;

  constructor(maxEntries = DEFAULT_MAX_ENTRIES) {
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new Error(`Invalid terrain cache size: ${maxEntries}`);
    }
    this.maxEntries = maxEntries;
  }

  get size() {
    return this.geometries.size;
  }

  get(id: ChunkId): THREE.BufferGeometry | undefined {
    return this.geometries.get(chunkKey(id));
  }

  has(id: ChunkId): boolean {
    return this.geometries.has(chunkKey(id));
  }

  set(id: ChunkId, geometry: THREE.BufferGeometry): void {
    const key = chunkKey(id);
    const existing = this.geometries.get(key);

    if (existing) {
      existing.dispose();
    } else {
      this.insertionOrder.push(key);
    }

    this.geometries.set(key, geometry);
    this.evictOldest();
  }

  clear(): void {
    for (const geometry of this.geometries.values()) {
      geometry.dispose();
    }
    this.geometries.clear();
    this.insertionOrder = [];
  }

  private evictOldest() {
    while (this.geometries.size > this.maxEntries) {
      const key = this.insertionOrder.shift();
      if (!key) return;

      const geometry = this.geometries.get(key);
      if (!geometry) continue;

      geometry.dispose();
      this.geometries.delete(key);
    }
  }
}
