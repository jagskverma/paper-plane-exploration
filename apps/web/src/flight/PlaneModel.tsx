import { useGLTF } from "@react-three/drei";

export function PlaneModel() {
  const { scene } = useGLTF("/paper-plane.glb");
  // Model faces +Z, flight system uses -Z. Rotate 180° to face forward.
  return (
    <group rotation={[0, Math.PI, 0]}>
      <primitive object={scene} scale={[0.3, 0.3, 0.3]} />
    </group>
  );
}

useGLTF.preload("/paper-plane.glb");
