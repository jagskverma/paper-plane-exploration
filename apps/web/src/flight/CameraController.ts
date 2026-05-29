import * as THREE from "three";
import type { FlightState } from "./FlightController";

const FOLLOW_DIST = 2.8;
const HEIGHT_OFFSET = 0.8;
const LOOK_AHEAD = 3.5;
const SMOOTHING = 4.0;

/**
 * Simple follow camera — always behind the plane, surface-up aligned.
 * No banking influence, just smooth tracking.
 */
export class CameraController {
  private pos: THREE.Vector3 = new THREE.Vector3(0, 5, 4);
  private look: THREE.Vector3 = new THREE.Vector3(0, 5, -10);

  update(flight: FlightState, dt: number) {
    dt = Math.min(dt, 0.1);
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(flight.rotation);
    const surfaceUp = flight.position.clone().normalize();

    // Camera behind the plane
    const targetPos = flight.position.clone()
      .addScaledVector(fwd, -FOLLOW_DIST)
      .addScaledVector(surfaceUp, HEIGHT_OFFSET);

    // Look at a point ahead of the plane
    const targetLook = flight.position.clone()
      .addScaledVector(fwd, LOOK_AHEAD);

    const t = 1 - Math.exp(-SMOOTHING * dt);
    this.pos.lerp(targetPos, t);
    this.look.lerp(targetLook, t);

    return { position: this.pos.clone(), lookAt: this.look.clone() };
  }

  snap(flight: FlightState) {
    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(flight.rotation);
    const surfaceUp = flight.position.clone().normalize();
    this.pos
      .copy(flight.position)
      .addScaledVector(fwd, -FOLLOW_DIST)
      .addScaledVector(surfaceUp, HEIGHT_OFFSET);
    this.look.copy(flight.position).addScaledVector(fwd, LOOK_AHEAD);
  }
}
