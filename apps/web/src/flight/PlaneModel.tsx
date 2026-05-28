import { useMemo } from "react";
import * as THREE from "three";

/**
 * Procedural lowpoly paper plane model.
 * Built from merged BufferGeometry — no external assets needed.
 *
 * The plane faces forward along the +Z axis (Three.js default).
 * Nose at the front, wings spread horizontally.
 */
export function PlaneModel() {
  const geometry = useMemo(() => buildPlaneGeometry(), []);

  return (
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial
        color="#f5f0e8"
        roughness={0.6}
        metalness={0.05}
        flatShading
      />
    </mesh>
  );
}

function buildPlaneGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  // Helper to add a triangle and return its starting vertex index
  function addTriangle(
    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number,
    x3: number, y3: number, z3: number,
  ): number {
    const start = vertices.length / 3;
    vertices.push(x1, y1, z1, x2, y2, z2, x3, y3, z3);
    indices.push(start, start + 1, start + 2);
    return start;
  }

  // Body — central diamond/fuselage (top half + bottom half)
  const bodyLength = 2.0;
  const bodyWidth = 0.15;
  const bodyHeight = 0.08;

  // Top body surface (two triangles forming a diamond along XZ plane)
  // Nose at z=-1, tail at z=+1
  addTriangle(
    0, 0, -bodyLength,           // nose tip
    -bodyWidth, bodyHeight, bodyLength,  // tail left top
    bodyWidth, bodyHeight, bodyLength,   // tail right top
  );

  // Bottom body surface
  addTriangle(
    0, 0, -bodyLength,           // nose tip
    bodyWidth, -bodyHeight, bodyLength,  // tail right bottom
    -bodyWidth, -bodyHeight, bodyLength, // tail left bottom
  );

  // Left wing (top surface)
  const wingSpan = 0.8;
  const wingChord = 0.6;
  const wingRootZ = 0.0;
  const wingTipZ = 0.4;
  const wingDihedral = 0.15; // slight upward angle at tips

  // Left wing top
  addTriangle(
    0, 0, wingRootZ,                          // root leading edge
    -wingSpan, wingDihedral, wingTipZ,          // tip
    0, 0, wingRootZ + wingChord,               // root trailing edge
  );
  addTriangle(
    0, 0, wingRootZ + wingChord,               // root trailing edge
    -wingSpan, wingDihedral, wingTipZ,          // tip
    -wingSpan, wingDihedral, wingTipZ + wingChord * 0.5, // tip trailing edge
  );

  // Right wing top
  addTriangle(
    0, 0, wingRootZ,                          // root leading edge
    0, 0, wingRootZ + wingChord,              // root trailing edge
    wingSpan, wingDihedral, wingTipZ,           // tip
  );
  addTriangle(
    0, 0, wingRootZ + wingChord,              // root trailing edge
    wingSpan, wingDihedral, wingTipZ + wingChord * 0.5, // tip trailing edge
    wingSpan, wingDihedral, wingTipZ,           // tip
  );

  // Left wing bottom
  addTriangle(
    0, 0, wingRootZ,
    -wingSpan, -wingDihedral * 0.5, wingTipZ,
    0, 0, wingRootZ + wingChord,
  );
  addTriangle(
    0, 0, wingRootZ + wingChord,
    -wingSpan, -wingDihedral * 0.5, wingTipZ,
    -wingSpan, -wingDihedral * 0.5, wingTipZ + wingChord * 0.5,
  );

  // Right wing bottom
  addTriangle(
    0, 0, wingRootZ,
    0, 0, wingRootZ + wingChord,
    wingSpan, -wingDihedral * 0.5, wingTipZ,
  );
  addTriangle(
    0, 0, wingRootZ + wingChord,
    wingSpan, -wingDihedral * 0.5, wingTipZ + wingChord * 0.5,
    wingSpan, -wingDihedral * 0.5, wingTipZ,
  );

  // Vertical tail fin
  addTriangle(
    0, 0, bodyLength - 0.3,      // fin root
    0, 0.15, bodyLength + 0.1,   // fin tip top
    0, 0, bodyLength + 0.2,      // fin root back
  );
  addTriangle(
    0, 0, bodyLength - 0.3,
    0, 0, bodyLength + 0.2,
    0, -0.05, bodyLength + 0.1,
  );

  geo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geo.setIndex(indices);
  geo.computeVertexNormals();

  return geo;
}
