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
import { AssetScaleReview } from "../world/AssetScaleReview";
import { CubeSpherePlanet } from "../world/CubeSpherePlanet";
import { SceneryStreamer, type SceneryViewer } from "../world/SceneryStreamer";
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
const SCENERY_SELECTION_UPDATE_DISTANCE = 55;
const SCENERY_SELECTION_UPDATE_ANGLE = THREE.MathUtils.degToRad(30);
const SCALE_REVIEW_CAMERA_POSITION = new THREE.Vector3(0, PLANET_RADIUS + 38, 95);
const SCALE_REVIEW_CAMERA_TARGET = new THREE.Vector3(0, PLANET_RADIUS + 8, -70);

function initialSceneryViewer(): SceneryViewer {
  return {
    position: new THREE.Vector3(0, PLANET_RADIUS + INITIAL_FLIGHT_ALTITUDE, 0),
    forward: new THREE.Vector3(0, 0, -1),
  };
}

function isScaleReviewMode() {
  return new URLSearchParams(window.location.search).has("scaleReview");
}

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
  const [sceneryViewer, setSceneryViewer] = useState(initialSceneryViewer);
  const [scaleReviewMode] = useState(isScaleReviewMode);
  const terrainViewerRef = useRef(terrainViewerPosition.clone());
  const sceneryViewerRef = useRef(initialSceneryViewer());
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
    if (scaleReviewMode) {
      camera.position.copy(SCALE_REVIEW_CAMERA_POSITION);
      camera.lookAt(SCALE_REVIEW_CAMERA_TARGET);
      return;
    }

    const input = inputRef.current.read();
    const flight = flightRef.current;

    flight.update(input, delta);
    const state = flight.getState();
    const stateForward = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(state.rotation)
      .normalize();

    if (
      state.position.distanceTo(terrainViewerRef.current) >
      TERRAIN_SELECTION_UPDATE_DISTANCE
    ) {
      terrainViewerRef.current.copy(state.position);
      setTerrainViewerPosition(state.position);
    }
    if (
      state.position.distanceTo(sceneryViewerRef.current.position) >
        SCENERY_SELECTION_UPDATE_DISTANCE ||
      stateForward.angleTo(sceneryViewerRef.current.forward) >
        SCENERY_SELECTION_UPDATE_ANGLE
    ) {
      sceneryViewerRef.current = {
        position: state.position.clone(),
        forward: stateForward.clone(),
      };
      setSceneryViewer(sceneryViewerRef.current);
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
                activeSceneryChunks: terrainMetricsRef.current?.activeSceneryChunks,
                sceneryObjects: terrainMetricsRef.current?.sceneryObjects,
                collidableSceneryObjects:
                  terrainMetricsRef.current?.collidableSceneryObjects,
                activeSceneryAssetTypes:
                  terrainMetricsRef.current?.activeSceneryAssetTypes,
              };
            }}
          />
        )
        : <CubeSpherePlanet />}
      {USE_CHUNKED_TERRAIN && scaleReviewMode && <AssetScaleReview />}
      {USE_CHUNKED_TERRAIN && !scaleReviewMode && (
        <SceneryStreamer
          viewer={sceneryViewer}
          onMetrics={(metrics) => {
            terrainMetricsRef.current = {
              ...terrainMetricsRef.current,
              visibleChunks: terrainMetricsRef.current?.visibleChunks ?? 0,
              generatedChunks: terrainMetricsRef.current?.generatedChunks ?? 0,
              cacheEntries: terrainMetricsRef.current?.cacheEntries ?? 0,
              approximateVertices: terrainMetricsRef.current?.approximateVertices ?? 0,
              ...metrics,
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
