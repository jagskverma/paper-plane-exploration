import * as THREE from "three";
import type { FlightInput } from "../input/FlightInput";

export interface FlightState {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  speed: number;
  bankAngle: number;
}

const BASE_SPEED = 12;
const PITCH_RATE = 1.0;
const ROLL_RATE = 2.5;

export class FlightController {
  private state: FlightState;

  constructor() {
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.1);
    this.state = {
      position: new THREE.Vector3(0, 5, 0),
      rotation: q,
      speed: BASE_SPEED,
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

    // Roll (left/right)
    const rollDelta = input.bank * ROLL_RATE * dt;
    if (Math.abs(rollDelta) > 0.0001) {
      const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
      this.state.rotation.multiply(
        new THREE.Quaternion().setFromAxisAngle(fwd, rollDelta),
      );
    }

    // Pitch (up/down)
    const pitchDelta = (input.throttle - input.pitch) * PITCH_RATE * dt;
    if (Math.abs(pitchDelta) > 0.0001) {
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.state.rotation);
      this.state.rotation.multiply(
        new THREE.Quaternion().setFromAxisAngle(right, pitchDelta),
      );
    }

    this.state.rotation.normalize();

    // Forward movement
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
    this.state.position.addScaledVector(forward, BASE_SPEED * dt);

    // Soft boundary
    const MAX_RANGE = 150;
    const dist = this.state.position.length();
    if (dist > MAX_RANGE) {
      this.state.position.multiplyScalar(MAX_RANGE / dist);
    }
  }

  reset(pos?: THREE.Vector3) {
    this.state.position.copy(pos ?? new THREE.Vector3(0, 5, 0));
    this.state.rotation.identity();
  }
}
