import * as THREE from "three";
import type { FlightState } from "./FlightController";

export interface CameraParams {
  /** Distance behind the plane. */
  followDistance: number;
  /** Height offset above the plane. */
  heightOffset: number;
  /** How far ahead of the plane to look (smooths the view). */
  lookAheadDistance: number;
  /** Position smoothing — lower = snappier, higher = more lag. */
  positionSmoothing: number;
  /** How much bank affects camera roll (0 = horizon locked, 1 = full roll). */
  bankInfluence: number;
}

const DEFAULT_CAMERA_PARAMS: CameraParams = {
  followDistance: 6,
  heightOffset: 1.5,
  lookAheadDistance: 4,
  positionSmoothing: 4.0,
  bankInfluence: 0.25,
};

/**
 * Damped follow camera for the paper plane.
 * Smoothly tracks position and orientation for a cinematic feel.
 */
export class CameraController {
  readonly params: CameraParams;
  private currentPosition: THREE.Vector3;
  private currentLookAt: THREE.Vector3;

  constructor(params: Partial<CameraParams> = {}) {
    this.params = { ...DEFAULT_CAMERA_PARAMS, ...params };
    this.currentPosition = new THREE.Vector3(0, 5, 8);
    this.currentLookAt = new THREE.Vector3(0, 5, 0);
  }

  /**
   * Update the camera transform based on the plane's flight state.
   * Returns the new camera position and look-at target.
   */
  update(
    flight: FlightState,
    dt: number,
  ): { position: THREE.Vector3; lookAt: THREE.Vector3 } {
    const p = this.params;
    dt = Math.min(dt, 0.1);

    // Forward and up in world space
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(flight.rotation);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(flight.rotation);

    // Target camera position: behind + above the plane
    const targetPos = flight.position
      .clone()
      .addScaledVector(forward, -p.followDistance)
      .addScaledVector(up, p.heightOffset);

    // Target look-at: ahead of the plane in its forward direction
    const targetLookAt = flight.position
      .clone()
      .addScaledVector(forward, p.lookAheadDistance);

    // Smooth interpolation
    const smoothFactor = 1 - Math.exp(-p.positionSmoothing * dt);
    this.currentPosition.lerp(targetPos, smoothFactor);
    this.currentLookAt.lerp(targetLookAt, smoothFactor);

    return {
      position: this.currentPosition.clone(),
      lookAt: this.currentLookAt.clone(),
    };
  }

  /** Snap camera to position (no smoothing). Use for initialization. */
  snap(flight: FlightState) {
    const p = this.params;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(flight.rotation);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(flight.rotation);

    this.currentPosition
      .copy(flight.position)
      .addScaledVector(forward, -p.followDistance)
      .addScaledVector(up, p.heightOffset);

    this.currentLookAt
      .copy(flight.position)
      .addScaledVector(forward, p.lookAheadDistance);
  }
}
