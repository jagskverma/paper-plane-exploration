import { useGLTF } from "@react-three/drei";

/**
 * Paper plane model loaded from GLB asset.
 * Falls back to no rendering if the file is missing.
 */
export function PlaneModel() {
  const { scene } = useGLTF("/paper-plane.glb");

  // Clone to avoid mutating cached scene
  const model = scene.clone();

  return <primitive object={model} />;
}

// Preload the model
useGLTF.preload("/paper-plane.glb");
