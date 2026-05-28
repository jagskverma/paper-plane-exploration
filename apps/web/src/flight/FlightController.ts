import * as THREE from "three";
import type { FlightInput } from "../input/FlightInput";
import { PLANET_RADIUS } from "../world/Planet";

export interface FlightState {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  altitude: number;
  speed: number;
  bankAngle: number;
}

const BASE_SPEED = 20;
const PITCH_RATE = 1.2;
const ROLL_RATE = 2.5;
const MIN_ALTITUDE = 15;
const GRAVITY = 1.5;
const LEVEL_RATE = 2.0;

export class FlightController {
  private state: FlightState;
  private frameCount = 0;

  constructor() {
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.05);
    this.state = {
      position: new THREE.Vector3(0, PLANET_RADIUS + 60, 0),
      rotation: q,
      altitude: 60,
      speed: BASE_SPEED,
      bankAngle: 0,
    };
  }

  getState(): FlightState {
    return {
      position: this.state.position.clone(),
      rotation: this.state.rotation.clone(),
      altitude: this.state.altitude,
      speed: this.state.speed,
      bankAngle: this.state.bankAngle,
    };
  }

  update(input: FlightInput, dt: number) {
    dt = Math.min(dt, 0.1);
    if (dt <= 0) return;

    // Roll
    const rollDelta = input.bank * ROLL_RATE * dt;
    if (Math.abs(rollDelta) > 0.0001) {
      const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
      this.state.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(fwd, rollDelta));
    }
    // Pitch
    const pitchDelta = (input.throttle - input.pitch) * PITCH_RATE * dt;
    if (Math.abs(pitchDelta) > 0.0001) {
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.state.rotation);
      this.state.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(right, pitchDelta));
    }
    this.state.rotation.normalize();

    // Forward movement
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
    this.state.position.addScaledVector(forward, BASE_SPEED * dt);

    // Planet-relative vectors
    const normal = this.state.position.clone().normalize();
    const toCenter = normal.clone().multiplyScalar(-1);
    this.state.altitude = this.state.position.length() - PLANET_RADIUS;

    // Gravity + lift
    if (this.state.altitude >= MIN_ALTITUDE) {
      this.state.position.addScaledVector(toCenter, GRAVITY * dt);
      // Simple lift to balance gravity at level flight
      const liftForce = GRAVITY * 0.95; // slightly less than gravity → gentle sink
      this.state.position.addScaledVector(normal, liftForce * dt);
    }

    if (this.state.altitude < MIN_ALTITUDE) {
      this.state.position.copy(normal.multiplyScalar(PLANET_RADIUS + MIN_ALTITUDE));
    }

    // Gentle auto-level
    const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.state.rotation);
    const axis = new THREE.Vector3().crossVectors(localUp, normal).normalize();
    const angle = Math.acos(THREE.MathUtils.clamp(localUp.dot(normal), -1, 1));
    if (angle > 0.001) {
      const corr = Math.min(angle, LEVEL_RATE * dt);
      this.state.rotation.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, corr));
      this.state.rotation.normalize();
    }

    // Debug
    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      console.log(`alt=${this.state.altitude.toFixed(0)} upComp=${forward.dot(normal).toFixed(2)}`);
    }
  }

  reset() {
    this.state.position.set(0, PLANET_RADIUS + 60, 0);
    this.state.rotation.identity();
    this.state.altitude = 60;
  }
}
