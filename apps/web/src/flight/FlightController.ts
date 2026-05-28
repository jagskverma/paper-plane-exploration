import * as THREE from "three";
import type { FlightInput } from "../input/FlightInput";

/**
 * Core flight state for the paper plane.
 */
export interface FlightState {
  /** World-space position. */
  position: THREE.Vector3;
  /** Rotation quaternion (local → world). Forward = -Z in local space. */
  rotation: THREE.Quaternion;
  /** Current speed (scalar, units/sec). Always positive in flight. */
  speed: number;
  /** Current bank angle in radians (for camera and visual feedback). */
  bankAngle: number;
}

/**
 * Parameters that define flight feel. Tune these to dial in the experience.
 */
export interface FlightParams {
  /** Base speed the plane naturally maintains (units/sec). */
  baseSpeed: number;
  /** Maximum speed from diving. */
  maxSpeed: number;
  /** Minimum speed before stall-like behavior. */
  minSpeed: number;
  /** How fast pitch input rotates the plane (rad/sec at full input). */
  pitchRate: number;
  /** How fast bank input rolls the plane (rad/sec at full input). */
  bankRate: number;
  /** Degrees of yaw per second per degree of bank (bank-to-turn coupling). */
  yawPerBank: number;
  /** Gravity acceleration (units/sec²). Pulls plane downward. */
  gravity: number;
  /** Drag coefficient — higher = more deceleration. */
  drag: number;
  /** How much pitch angle affects speed (diving adds speed, climbing loses it). */
  pitchSpeedEffect: number;
  /** Maximum bank angle in radians. */
  maxBank: number;
  /** Maximum pitch angle in radians. */
  maxPitch: number;
  /** Smoothing factor for input (0=no smoothing, closer to 1=slower response). */
  inputSmoothing: number;
}

const DEFAULT_PARAMS: FlightParams = {
  baseSpeed: 12,
  maxSpeed: 25,
  minSpeed: 4,
  pitchRate: 1.2,
  bankRate: 2.0,
  yawPerBank: 0.8,
  gravity: 0.5,
  drag: 0.3,
  pitchSpeedEffect: 8.0,
  maxBank: Math.PI / 5, // ~36 degrees
  maxPitch: Math.PI / 6, // ~30 degrees
  inputSmoothing: 0.85,
};

/**
 * Pure flight physics simulation.
 *
 * Consumes FlightInput each frame and produces updated FlightState.
 * No rendering, no camera, no side effects — just math.
 */
export class FlightController {
  readonly params: FlightParams;
  private state: FlightState;
  private smoothedInput: FlightInput = { bank: 0, pitch: 0, throttle: 0 };

  constructor(params: Partial<FlightParams> = {}) {
    this.params = { ...DEFAULT_PARAMS, ...params };
    this.state = {
      position: new THREE.Vector3(0, 5, 0),
      rotation: new THREE.Quaternion().identity(),
      speed: this.params.baseSpeed,
      bankAngle: 0,
    };
  }

  /** Read current state (clone to prevent mutation). */
  getState(): FlightState {
    return {
      position: this.state.position.clone(),
      rotation: this.state.rotation.clone(),
      speed: this.state.speed,
      bankAngle: this.state.bankAngle,
    };
  }

  /**
   * Advance the simulation by `dt` seconds using the given input.
   */
  update(input: FlightInput, dt: number) {
    // Clamp dt to prevent physics explosion on tab-switch
    dt = Math.min(dt, 0.1);
    if (dt <= 0) return;

    const p = this.params;

    // Smooth input
    const s = p.inputSmoothing;
    this.smoothedInput = {
      bank: lerp(this.smoothedInput.bank, input.bank, 1 - s),
      pitch: lerp(this.smoothedInput.pitch, input.pitch, 1 - s),
      throttle: input.throttle, // throttle is digital, no smoothing needed
    };

    const si = this.smoothedInput;

    // --- Speed ---
    // Pitch affects speed: diving = faster, climbing = slower
    const pitchSpeedDelta = -si.pitch * p.pitchSpeedEffect * dt;
    // Throttle (W/S keys) adds a boost
    const throttleEffect = si.throttle * 6 * dt;
    // Drag
    const dragEffect = (this.state.speed - p.baseSpeed) * p.drag * dt;
    // Gravity component along velocity (planes trade altitude for speed)
    // This is handled naturally by the velocity update below

    this.state.speed += pitchSpeedDelta + throttleEffect - dragEffect;
    this.state.speed = THREE.MathUtils.clamp(this.state.speed, p.minSpeed, p.maxSpeed);

    // --- Rotation ---
    // Build rotation deltas in local space
    const pitchDelta = si.pitch * p.pitchRate * dt;
    const bankDelta = si.bank * p.bankRate * dt;

    // Clamp bank angle
    const newBank = THREE.MathUtils.clamp(
      this.state.bankAngle + bankDelta,
      -p.maxBank,
      p.maxBank,
    );
    const actualBankDelta = newBank - this.state.bankAngle;
    this.state.bankAngle = newBank;

    // Yaw from bank (bank-to-turn)
    const yawDelta = this.state.bankAngle * p.yawPerBank * dt;

    // Apply rotations in local space
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0), // local right axis
      pitchDelta,
    );
    const bankQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, -1), // local forward axis (-Z)
      actualBankDelta,
    );
    const yawQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), // local up axis
      yawDelta,
    );

    // Combine: yaw → pitch → bank (order matters)
    const rotationDelta = new THREE.Quaternion()
      .multiplyQuaternions(yawQuat, pitchQuat)
      .multiply(bankQuat);

    this.state.rotation.multiply(rotationDelta);
    this.state.rotation.normalize();

    // --- Position ---
    // Forward = local -Z rotated to world space
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
    // Gravity pulls the plane down
    const gravityVec = new THREE.Vector3(0, -p.gravity * dt, 0);

    // Velocity = forward * speed, with a slight upward bias when pitched up
    // to make climbing feel more natural (paper planes get lift from pitch)
    const pitchLift = si.pitch * 2.0 * dt;
    const velocity = forward
      .clone()
      .multiplyScalar(this.state.speed * dt)
      .add(new THREE.Vector3(0, pitchLift, 0))
      .add(gravityVec);

    this.state.position.add(velocity);
  }

  /** Reset position and rotation. */
  reset(position?: THREE.Vector3) {
    this.state.position.copy(position ?? new THREE.Vector3(0, 5, 0));
    this.state.rotation.identity();
    this.state.speed = this.params.baseSpeed;
    this.state.bankAngle = 0;
    this.smoothedInput = { bank: 0, pitch: 0, throttle: 0 };
  }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
