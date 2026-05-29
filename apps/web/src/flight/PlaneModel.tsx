import { useMemo } from "react";
import * as THREE from "three";

function triangleGeometry(points: [THREE.Vector3, THREE.Vector3, THREE.Vector3]) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setIndex([0, 1, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

export function PlaneModel() {
  const geometry = useMemo(() => {
    const nose = new THREE.Vector3(0, 0.08, -1.35);
    const ridge = new THREE.Vector3(0, 0.34, 0.45);
    const tail = new THREE.Vector3(0, -0.16, 0.92);
    const leftWing = new THREE.Vector3(-0.95, -0.08, 0.58);
    const rightWing = new THREE.Vector3(0.95, -0.08, 0.58);

    return {
      leftTop: triangleGeometry([nose, ridge, leftWing]),
      rightTop: triangleGeometry([nose, rightWing, ridge]),
      leftUnderside: triangleGeometry([nose, leftWing, tail]),
      rightUnderside: triangleGeometry([nose, tail, rightWing]),
      centerFold: triangleGeometry([nose, tail, ridge]),
    };
  }, []);

  return (
    <group>
      <mesh geometry={geometry.leftTop}>
        <meshStandardMaterial color="#f4f4ef" roughness={0.82} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry.rightTop}>
        <meshStandardMaterial color="#e6e6df" roughness={0.86} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry.leftUnderside}>
        <meshStandardMaterial color="#cfcfc8" roughness={0.88} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry.rightUnderside}>
        <meshStandardMaterial color="#bdbdb6" roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={geometry.centerFold}>
        <meshStandardMaterial color="#a9aaa5" roughness={0.88} metalness={0} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
