import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export function PlaneModel() {
  const { scene } = useGLTF("/paper-plane.glb");

  useEffect(() => {
    // Force visible material on all meshes
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#f5f0e8",
          roughness: 0.6,
          metalness: 0.05,
          flatShading: true,
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={[0.3, 0.3, 0.3]} />;
}

useGLTF.preload("/paper-plane.glb");
