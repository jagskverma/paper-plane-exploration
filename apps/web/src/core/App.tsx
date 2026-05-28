import { Canvas } from "@react-three/fiber";

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#1a1a2e" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <mesh>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      </Canvas>
    </div>
  );
}
