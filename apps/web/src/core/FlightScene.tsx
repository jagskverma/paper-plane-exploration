import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { FlightController } from "../flight/FlightController";
import { CameraController } from "../flight/CameraController";
import { PlaneModel } from "../flight/PlaneModel";
import { InputManager } from "../input/InputManager";
import { Atmosphere } from "../rendering/Atmosphere";
import { CubeSpherePlanet } from "../world/CubeSpherePlanet";
import { flightControllerRef } from "./flightRef";

export function FlightScene() {
  const flightRef = useRef<FlightController>(new FlightController());
  const cameraRef = useRef<CameraController>(new CameraController());
  const inputRef = useRef<InputManager>(new InputManager());
  const planeRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const input = inputRef.current;
    input.start(canvas);
    flightControllerRef.current = flightRef.current;
    cameraRef.current.snap(flightRef.current.getState());
    return () => {
      input.stop();
      flightControllerRef.current = null;
    };
  }, [gl]);

  useFrame((_, delta) => {
    const input = inputRef.current.read();
    const flight = flightRef.current;

    flight.update(input, delta);
    const state = flight.getState();

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
      <CubeSpherePlanet />
      <group ref={planeRef}>
        <PlaneModel />
      </group>
    </>
  );
}
