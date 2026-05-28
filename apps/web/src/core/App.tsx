import { Canvas } from "@react-three/fiber";
import { FlightScene } from "./FlightScene";
import { DebugHud } from "../ui/DebugHud";
import { flightControllerRef } from "./flightRef";

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 60, near: 1, far: 5000 }}
      >
        <FlightScene />
      </Canvas>
      <DebugHud
        getState={() => flightControllerRef.current?.getState() ?? null}
      />
    </div>
  );
}
