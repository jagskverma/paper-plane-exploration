import * as THREE from "three";
import type { FlightInput } from "../input/FlightInput";

export interface FlightState {
  position: THREE.Vector3;
  /** Heading quaternion (yaw only — no banking). Forward = -Z. */
  rotation: THREE.Quaternion;
  speed: number;
  bankAngle: number; // kept for camera compatibility, always 0
}

const MOVE_SPEED = 15;
const TURN_SPEED = 2.5; // rad/sec

export class FlightController {
  private state: FlightState;

  constructor() {
    this.state = {
      position: new THREE.Vector3(0, 5, 0),
      rotation: new THREE.Quaternion().identity(),
      speed: MOVE_SPEED,
      bankAngle: 0,
    };
  }

  getState(): FlightState {
    return {
      position: this.state.position.clone(),
      rotation: this.state.rotation.clone(),
      speed: this.state.speed,
      bankAngle: this.state.bankAngle,
    };
  }

  update(input: FlightInput, dt: number) {
    dt = Math.min(dt, 0.1);
    if (dt <= 0) return;

    // Arrow Up/Down = move forward/backward
    const forwardMove = input.throttle * MOVE_SPEED * dt; // Up arrow
    const backwardMove = -input.pitch * MOVE_SPEED * dt;  // Down arrow (negative pitch)

    // Arrow Left/Right = turn (yaw)
    const yawDelta = input.bank * TURN_SPEED * dt; // negative bank = left turn

    // Apply yaw rotation
    if (yawDelta !== 0) {
      const yawQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        yawDelta,
      );
      this.state.rotation.multiply(yawQuat);
      this.state.rotation.normalize();
    }

    // Forward vector in world space
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      this.state.rotation,
    );

    // Total forward movement
    const totalForward = forwardMove + backwardMove;
    if (totalForward !== 0) {
      this.state.position.addScaledVector(forward, totalForward);
    }
  }

  reset(position?: THREE.Vector3) {
    this.state.position.copy(position ?? new THREE.Vector3(0, 5, 0));
    this.state.rotation.identity();
    this.state.speed = MOVE_SPEED;
    this.state.bankAngle = 0;
  }
}
