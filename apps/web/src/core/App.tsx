import { Canvas } from "@react-three/fiber";
import { FlightScene } from "./FlightScene";

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 60, near: 0.5, far: 500 }}
      >
        <FlightScene />
      </Canvas>
    </div>
  );
}
