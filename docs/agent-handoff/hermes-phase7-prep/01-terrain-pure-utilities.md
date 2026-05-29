# Objective

Implement pure TypeScript terrain utility modules for Phase 7 chunk identity and cube-sphere mapping.

# Why

Phase 7 terrain streaming needs stable, inspectable chunk IDs and deterministic face-local mapping before any rendering or streaming is added. This task gives Codex a safe foundation to build on later.

# Constraints

- Code only inside `apps/web/src/terrain/`.
- No React components.
- No Three.js scene objects, meshes, materials, or R3F hooks.
- No terrain rendering.
- No changes to `FlightScene`.
- No changes to `CubeSpherePlanet`.
- No dependencies.
- No test framework.
- No worker code.
- Pure functions only.
- Functions must be deterministic and side-effect free.
- Do not import from `src/world/`.
- It is acceptable to import `THREE.Vector3` from `three` for vector return values.

# Existing Context

- ADR-001 chose cube-sphere topology.
- ADR-002 proposes chunk identity as `{ face, level, x, y }`.
- Current terrain rendering lives in `apps/web/src/world/CubeSpherePlanet.tsx`.
- Current terrain height function lives in `apps/web/src/procedural/TerrainHeight.ts`.
- Current rendered cube-sphere mapping exists inside `CubeSpherePlanet`, but it is not reusable by terrain.

# Deliverables

Create:

- `apps/web/src/terrain/ChunkId.ts`
- `apps/web/src/terrain/CubeSphereMapping.ts`
- `apps/web/src/terrain/README.md`

Do not modify existing runtime wiring.

# Required API: `ChunkId.ts`

Implement exactly these exports:

```ts
export type CubeFace = 0 | 1 | 2 | 3 | 4 | 5;

export interface ChunkId {
  face: CubeFace;
  level: number;
  x: number;
  y: number;
}

export function chunkKey(id: ChunkId): string;
export function parseChunkKey(key: string): ChunkId;
export function chunksPerAxis(level: number): number;
export function validateChunkId(id: ChunkId): boolean;
export function chunkUvBounds(id: ChunkId): {
  u0: number;
  v0: number;
  u1: number;
  v1: number;
};
export function parentChunk(id: ChunkId): ChunkId | null;
export function childChunks(id: ChunkId): ChunkId[];
export function sameChunk(a: ChunkId, b: ChunkId): boolean;
```

Implementation rules:

- `chunkKey` format must be exactly: `f${face}:l${level}:x${x}:y${y}`.
- `parseChunkKey` must parse only that format and throw `Error` on invalid input.
- `level` must be an integer `>= 0`.
- `x` and `y` must be integers in `[0, 2 ** level - 1]`.
- `chunksPerAxis(level)` must throw for invalid `level`.
- `chunkUvBounds` must return normalized face UVs in `[0, 1]`.
- `parentChunk({ level: 0 })` returns `null`.
- `childChunks` returns four children in deterministic order:
  1. northwest / lower x, lower y
  2. northeast / higher x, lower y
  3. southwest / lower x, higher y
  4. southeast / higher x, higher y

# Required API: `CubeSphereMapping.ts`

Implement exactly these exports:

```ts
import * as THREE from "three";
import type { CubeFace } from "./ChunkId";

export interface FaceUv {
  face: CubeFace;
  u: number;
  v: number;
}

export function faceUvToCubePoint(face: CubeFace, u: number, v: number): THREE.Vector3;
export function faceUvToDirection(face: CubeFace, u: number, v: number): THREE.Vector3;
export function directionToFaceUv(direction: THREE.Vector3): FaceUv;
export function chunkGridPointToDirection(
  face: CubeFace,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  gridX: number,
  gridY: number,
  resolution: number,
): THREE.Vector3;
```

Face mapping must be documented in comments and must be deterministic. Use this face convention:

- `0`: `+X`
- `1`: `-X`
- `2`: `+Y`
- `3`: `-Y`
- `4`: `+Z`
- `5`: `-Z`

Implementation rules:

- `u` and `v` are normalized `[0, 1]`.
- Convert to cube coordinates with `a = u * 2 - 1`, `b = v * 2 - 1`.
- `faceUvToCubePoint` returns an unnormalized cube point on the selected face.
- `faceUvToDirection` normalizes that cube point.
- `directionToFaceUv` must choose the dominant absolute axis.
- `directionToFaceUv(faceUvToDirection(face, u, v))` should round-trip to the same face and approximately same `u/v` for non-edge points.
- `chunkGridPointToDirection` maps grid point `[0..resolution]` to an interpolated chunk UV and then to sphere direction.
- Throw `Error` for invalid face, UV, grid point, or resolution.

# Required API: `terrain/README.md`

Document:

- Why this folder exists.
- What these pure utilities own.
- What they must not own.
- The face numbering convention.
- That these files are not wired into rendering yet.

# Acceptance Criteria

- `pnpm lint` passes from `apps/web`.
- `pnpm build` passes from `apps/web`.
- No current visual behavior changes.
- No imports from `terrain/` into `core`, `flight`, `world`, or `rendering` yet.
- Public APIs match the exact names above.

# Non-Goals

- No geometry generation.
- No rendering.
- No chunk cache.
- No LOD selection.
- No terrain replacement.
- No unit test framework.

# Technical Notes

If you want to validate behavior manually, create a temporary local script outside the repo or use `tsx` only if already available. Do not add validation scripts to `package.json`.
