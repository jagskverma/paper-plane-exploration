import { useGLTF } from "@react-three/drei";

export function PlaneModel() {
  const { scene } = useGLTF("/paper-plane.glb");
  // Scale up if the model is tiny, and make it visible
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} />;
}

useGLTF.preload("/paper-plane.glb");
