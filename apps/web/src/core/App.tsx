import { Canvas } from "@react-three/fiber";
import { FlightScene } from "./FlightScene";
import { DebugHud } from "../ui/DebugHud";
import { ModeBanner } from "../ui/ModeBanner";
import { flightControllerRef } from "./flightRef";
import { terrainMetricsRef } from "./terrainMetricsRef";

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ fov: 60, near: 1, far: 20000 }}
      >
        <FlightScene />
      </Canvas>
      <DebugHud
        getState={() => flightControllerRef.current?.getState() ?? null}
        getTerrainMetrics={() => terrainMetricsRef.current}
      />
      <ModeBanner />
    </div>
  );
}
