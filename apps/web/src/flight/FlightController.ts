import * as THREE from "three";
import type { FlightInput } from "../input/FlightInput";
import { PLANET_RADIUS } from "../world/CubeSpherePlanet";

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
const MIN_ALTITUDE = 50;
const GRAVITY = 1.5;
const LEVEL_RATE = 2.0;

export class FlightController {
  private state: FlightState;
  private logCounter = 0;

  constructor() {
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.05);
    this.state = {
      position: new THREE.Vector3(0, PLANET_RADIUS + 200, 0),
      rotation: q,
      altitude: 200,
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

    // Log inputs
    this.logCounter++;
    const shouldLog = this.logCounter % 120 === 0;

    if (shouldLog) {
      console.log(`[FLIGHT] dt=${dt.toFixed(4)} input=(b:${input.bank.toFixed(2)} p:${input.pitch.toFixed(2)} t:${input.throttle.toFixed(2)})`);
      console.log(`[FLIGHT] BEFORE pos=(${this.state.position.x.toFixed(0)},${this.state.position.y.toFixed(0)},${this.state.position.z.toFixed(0)}) alt=${this.state.altitude.toFixed(1)}`);
    }

    // --- Player controls ---
    const rollDelta = input.bank * ROLL_RATE * dt;
    if (Math.abs(rollDelta) > 0.0001) {
      const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
      this.state.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(fwd, rollDelta));
    }
    const pitchDelta = (input.throttle - input.pitch) * PITCH_RATE * dt;
    if (Math.abs(pitchDelta) > 0.0001) {
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.state.rotation);
      this.state.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(right, pitchDelta));
    }
    this.state.rotation.normalize();

    if (shouldLog) {
      const euler = new THREE.Euler().setFromQuaternion(this.state.rotation);
      console.log(`[FLIGHT] ROTATION euler=(${euler.x.toFixed(2)},${euler.y.toFixed(2)},${euler.z.toFixed(2)})`);
    }

    // --- Planet-relative ---
    const normal = this.state.position.clone().normalize();
    const toCenter = normal.clone().multiplyScalar(-1);
    this.state.altitude = this.state.position.length() - PLANET_RADIUS;

    if (shouldLog) {
      console.log(`[FLIGHT] PLANET normal=(${normal.x.toFixed(3)},${normal.y.toFixed(3)},${normal.z.toFixed(3)}) distFromCenter=${(PLANET_RADIUS + this.state.altitude).toFixed(1)}`);
    }

    // --- Forward movement (always tangent to surface) ---
    const rawFwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
    const tangentFwd = rawFwd.clone()
      .addScaledVector(normal, -rawFwd.dot(normal))
      .normalize();
    this.state.position.addScaledVector(tangentFwd, BASE_SPEED * dt);

    if (shouldLog) {
      console.log(`[FLIGHT] MOVE rawFwd=(${rawFwd.x.toFixed(3)},${rawFwd.y.toFixed(3)},${rawFwd.z.toFixed(3)}) tangentFwd=(${tangentFwd.x.toFixed(3)},${tangentFwd.y.toFixed(3)},${tangentFwd.z.toFixed(3)})`);
    }

    // --- Gravity + lift ---
    if (this.state.altitude >= MIN_ALTITUDE) {
      this.state.position.addScaledVector(toCenter, GRAVITY * dt);
      this.state.position.addScaledVector(normal, GRAVITY * dt);  // lift = gravity
    }
    if (this.state.altitude < MIN_ALTITUDE) {
      this.state.position.copy(normal.multiplyScalar(PLANET_RADIUS + MIN_ALTITUDE));
      if (shouldLog) console.log(`[FLIGHT] HARD FLOOR — clamped to ${MIN_ALTITUDE}m`);
    }

    // Recalculate altitude after all position changes
    const newDist = this.state.position.length();
    const newAlt = newDist - PLANET_RADIUS;

    if (shouldLog) {
      console.log(`[FLIGHT] AFTER pos=(${this.state.position.x.toFixed(0)},${this.state.position.y.toFixed(0)},${this.state.position.z.toFixed(0)}) dist=${newDist.toFixed(1)} alt=${newAlt.toFixed(1)}`);
      console.log(`[FLIGHT] ---`);
    }

    this.state.altitude = newAlt;

    // --- Gentle auto-level (visual only, doesn't affect flight path) ---
    const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(this.state.rotation);
    const axis = new THREE.Vector3().crossVectors(localUp, normal).normalize();
    const angle = Math.acos(THREE.MathUtils.clamp(localUp.dot(normal), -1, 1));
    if (angle > 0.001) {
      const corr = Math.min(angle, LEVEL_RATE * dt);
      this.state.rotation.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, corr));
      this.state.rotation.normalize();
    }
  }

  reset() {
    this.state.position.set(0, PLANET_RADIUS + 60, 0);
    this.state.rotation.identity();
    this.state.altitude = 60;
  }
}
