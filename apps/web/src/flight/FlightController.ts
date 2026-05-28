import * as THREE from "three";
import type { FlightInput } from "../input/FlightInput";

export interface FlightState {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  speed: number;
  bankAngle: number;
}

const BASE_SPEED = 12;
const PITCH_RATE = 0.8; // rad/sec — gentle pitch
const BANK_RATE = 1.5;  // rad/sec — smooth bank
const YAW_PER_BANK = 0.8; // yaw rate per radian of bank
const MAX_BANK = Math.PI / 10; // ~18 degrees — subtle tilt

export class FlightController {
  private state: FlightState;

  constructor() {
    const q = new THREE.Quaternion();
    // Start slightly pitched down for forward visibility
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

    // --- Bank (roll) ---
    // Left/Right arrow → bank angle
    const bankTarget = input.bank * MAX_BANK;
    const bankDelta = THREE.MathUtils.clamp(
      bankTarget - this.state.bankAngle, -BANK_RATE * dt, BANK_RATE * dt,
    );
    this.state.bankAngle += bankDelta;

    // --- Pitch ---
    // ArrowUp (throttle) = nose up, ArrowDown (pitch) = nose down
    const pitchDelta = (input.throttle - input.pitch) * PITCH_RATE * dt;

    // --- Yaw from bank ---
    const yawDelta = this.state.bankAngle * YAW_PER_BANK * dt;

    // Apply rotations
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0), // local right
      pitchDelta,
    );
    const bankQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, -1), // local forward
      bankDelta,
    );
    const yawQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), // world up (yaw uses world up for natural turning)
      yawDelta,
    );

    this.state.rotation.multiply(yawQuat).multiply(pitchQuat).multiply(bankQuat);
    this.state.rotation.normalize();

    // --- Auto-forward movement ---
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      this.state.rotation,
    );
    this.state.position.addScaledVector(forward, BASE_SPEED * dt);

    // Slight lift when pitched up, slight drop when pitched down
    const pitchAngle = Math.asin(
      THREE.MathUtils.clamp(
        2 * (this.state.rotation.y * this.state.rotation.w),
        -1, 1,
      ),
    );
    this.state.position.y += pitchAngle * 3 * dt;
  }

  reset(pos?: THREE.Vector3) {
    this.state.position.copy(pos ?? new THREE.Vector3(0, 5, 0));
    this.state.rotation.identity();
    this.state.bankAngle = 0;
  }
}
