import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { FlightController } from "../flight/FlightController";
import type { FlightCollisionObstacle } from "../flight/FlightController";
import { CameraController } from "../flight/CameraController";
import { PlaneModel } from "../flight/PlaneModel";
import { InputManager } from "../input/InputManager";
import { Atmosphere } from "../rendering/Atmosphere";
import { TerrainRoot } from "../terrain/TerrainRoot";
import { CubeSpherePlanet } from "../world/CubeSpherePlanet";
import { ProceduralScenery } from "../world/ProceduralScenery";
import { ScaleTestObjects } from "../world/ScaleTestObjects";
import { getScaleTestCollisionObstacles } from "../world/ScaleTestPlacements";
import { flightControllerRef } from "./flightRef";
import { evaluateTerrainHeight } from "../procedural/TerrainHeight";
import { terrainMetricsRef } from "./terrainMetricsRef";
import {
  INITIAL_FLIGHT_ALTITUDE,
  PLANET_RADIUS,
  USE_CHUNKED_TERRAIN,
} from "./worldConfig";

const TERRAIN_SELECTION_UPDATE_DISTANCE = 50;

export function FlightScene() {
  const flightRef = useRef<FlightController>(
    new FlightController(evaluateTerrainHeight),
  );
  const cameraRef = useRef<CameraController>(new CameraController());
  const inputRef = useRef<InputManager>(new InputManager());
  const planeRef = useRef<THREE.Group>(null);
  const fixedCollisionObstaclesRef = useRef<FlightCollisionObstacle[]>(
    USE_CHUNKED_TERRAIN ? [] : getScaleTestCollisionObstacles(),
  );
  const [terrainViewerPosition, setTerrainViewerPosition] = useState(
    () => new THREE.Vector3(0, PLANET_RADIUS + INITIAL_FLIGHT_ALTITUDE, 0),
  );
  const terrainViewerRef = useRef(terrainViewerPosition.clone());
  const { camera, gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const input = inputRef.current;
    input.start(canvas);
    flightRef.current.setCollisionObstacles(fixedCollisionObstaclesRef.current);
    flightControllerRef.current = flightRef.current;
    terrainMetricsRef.current = null;
    cameraRef.current.snap(flightRef.current.getState());
    return () => {
      input.stop();
      flightControllerRef.current = null;
      terrainMetricsRef.current = null;
    };
  }, [gl]);

  useFrame((_, delta) => {
    const input = inputRef.current.read();
    const flight = flightRef.current;

    flight.update(input, delta);
    const state = flight.getState();
    if (
      state.position.distanceTo(terrainViewerRef.current) >
      TERRAIN_SELECTION_UPDATE_DISTANCE
    ) {
      terrainViewerRef.current.copy(state.position);
      setTerrainViewerPosition(state.position);
    }

    if (planeRef.current) {
      planeRef.current.position.copy(state.position);
      planeRef.current.quaternion.copy(state.rotation);
    }

    const cam = cameraRef.current.update(state, delta);
    camera.position.copy(cam.position);
    camera.lookAt(cam.lookAt);
  });

  return (
    <>
      <Atmosphere />
      {USE_CHUNKED_TERRAIN
        ? (
          <TerrainRoot
            viewerPosition={terrainViewerPosition}
            onMetrics={(metrics) => {
              terrainMetricsRef.current = {
                ...metrics,
                sceneryObjects: terrainMetricsRef.current?.sceneryObjects,
              };
            }}
          />
        )
        : <CubeSpherePlanet />}
      {USE_CHUNKED_TERRAIN && (
        <ProceduralScenery
          viewerPosition={terrainViewerPosition}
          onObjectCount={(count) => {
            terrainMetricsRef.current = {
              ...terrainMetricsRef.current,
              visibleChunks: terrainMetricsRef.current?.visibleChunks ?? 0,
              generatedChunks: terrainMetricsRef.current?.generatedChunks ?? 0,
              cacheEntries: terrainMetricsRef.current?.cacheEntries ?? 0,
              approximateVertices: terrainMetricsRef.current?.approximateVertices ?? 0,
              sceneryObjects: count,
            };
          }}
          onCollisionObstacles={(obstacles) => {
            flightRef.current.setCollisionObstacles([
              ...fixedCollisionObstaclesRef.current,
              ...obstacles,
            ]);
          }}
        />
      )}
      {!USE_CHUNKED_TERRAIN && <ScaleTestObjects />}
      <group ref={planeRef}>
        <PlaneModel />
      </group>
    </>
  );
}
