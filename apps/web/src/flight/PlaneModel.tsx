import { useGLTF } from "@react-three/drei";

export function PlaneModel() {
  const { scene } = useGLTF("/paper-plane.glb");
  return <primitive object={scene} />;
}

useGLTF.preload("/paper-plane.glb");
