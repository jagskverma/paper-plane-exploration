import * as THREE from "three";
import type { FlightInput } from "../input/FlightInput";
import {
  INITIAL_FLIGHT_ALTITUDE,
  MIN_FLIGHT_ALTITUDE,
  PLANET_RADIUS,
} from "../core/worldConfig";

export interface FlightState {
  position: THREE.Vector3;
  rotation: THREE.Quaternion;
  altitude: number;
  speed: number;
  bankAngle: number;
  pitchAngle: number;
}

const BASE_SPEED = 7.5;
const MIN_SPEED = 4.0;
const MAX_SPEED = 12.0;
const SPEED_RESPONSE = 1.8;
const GLIDE_SINK_RATE = 0;
const MAX_PITCH_ANGLE = THREE.MathUtils.degToRad(22);
const PITCH_RESPONSE = 5.0;
const PITCH_RETURN_RESPONSE = 3.5;
const MAX_BANK_ANGLE = THREE.MathUtils.degToRad(35);
const BANK_RESPONSE = 6.0;
const BANK_RETURN_RESPONSE = 4.0;
const BANK_TURN_RATE = 0.7;

export type TerrainHeightSampler = (surfaceNormal: THREE.Vector3) => number;

export interface FlightCollisionObstacle {
  center: THREE.Vector3;
  radius: number;
}

function buildSurfaceAlignedRotation(
  forward: THREE.Vector3,
  surfaceUp: THREE.Vector3,
  bankAngle: number,
) {
  const zAxis = forward.clone().negate().normalize();
  const xAxis = new THREE.Vector3().crossVectors(surfaceUp, zAxis).normalize();
  const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
  const matrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
  const baseRotation = new THREE.Quaternion().setFromRotationMatrix(matrix);
  const bankRotation = new THREE.Quaternion().setFromAxisAngle(forward, bankAngle);
  return bankRotation.multiply(baseRotation);
}

function fallbackTangent(surfaceUp: THREE.Vector3) {
  const reference = Math.abs(surfaceUp.y) < 0.9
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(1, 0, 0);
  return reference
    .addScaledVector(surfaceUp, -reference.dot(surfaceUp))
    .normalize();
}

export class FlightController {
  private state: FlightState;
  private getTerrainHeight: TerrainHeightSampler;
  private collisionObstacles: FlightCollisionObstacle[] = [];

  constructor(getTerrainHeight: TerrainHeightSampler = () => 0) {
    this.getTerrainHeight = getTerrainHeight;
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.05);
    const startNormal = new THREE.Vector3(0, 1, 0);
    const startSurfaceRadius = PLANET_RADIUS + this.getTerrainHeight(startNormal);
    this.state = {
      position: startNormal.multiplyScalar(startSurfaceRadius + INITIAL_FLIGHT_ALTITUDE),
      rotation: q,
      altitude: INITIAL_FLIGHT_ALTITUDE,
      speed: BASE_SPEED,
      bankAngle: 0,
      pitchAngle: 0,
    };
  }

  setCollisionObstacles(obstacles: FlightCollisionObstacle[]) {
    this.collisionObstacles = obstacles.map((obstacle) => ({
      center: obstacle.center.clone(),
      radius: obstacle.radius,
    }));
  }

  getState(): FlightState {
    return {
      position: this.state.position.clone(),
      rotation: this.state.rotation.clone(),
      altitude: this.state.altitude,
      speed: this.state.speed,
      bankAngle: this.state.bankAngle,
      pitchAngle: this.state.pitchAngle,
    };
  }

  update(input: FlightInput, dt: number) {
    dt = Math.min(dt, 0.1);
    if (dt <= 0) return;

    // --- Planet-relative ---
    const normal = this.state.position.clone().normalize();
    const toCenter = normal.clone().multiplyScalar(-1);
    const surfaceRadius = PLANET_RADIUS + this.getTerrainHeight(normal);
    this.state.altitude = this.state.position.length() - surfaceRadius;

    // --- Player controls ---
    const targetBank = input.bank * MAX_BANK_ANGLE;
    const bankResponse = input.bank === 0 ? BANK_RETURN_RESPONSE : BANK_RESPONSE;
    const bankT = 1 - Math.exp(-bankResponse * dt);
    this.state.bankAngle = THREE.MathUtils.lerp(
      this.state.bankAngle,
      targetBank,
      bankT,
    );

    const pitchInput = input.throttle - input.pitch;
    const targetPitch = pitchInput * MAX_PITCH_ANGLE;
    const pitchResponse = pitchInput === 0 ? PITCH_RETURN_RESPONSE : PITCH_RESPONSE;
    const pitchT = 1 - Math.exp(-pitchResponse * dt);
    this.state.pitchAngle = THREE.MathUtils.lerp(
      this.state.pitchAngle,
      targetPitch,
      pitchT,
    );

    const targetSpeed = THREE.MathUtils.clamp(
      BASE_SPEED - pitchInput * 2.5,
      MIN_SPEED,
      MAX_SPEED,
    );
    const speedT = 1 - Math.exp(-SPEED_RESPONSE * dt);
    this.state.speed = THREE.MathUtils.lerp(this.state.speed, targetSpeed, speedT);

    const heading = new THREE.Vector3(0, 0, -1).applyQuaternion(this.state.rotation);
    heading.addScaledVector(normal, -heading.dot(normal));
    if (heading.lengthSq() < 0.0001) {
      heading.copy(fallbackTangent(normal));
    } else {
      heading.normalize();
    }

    const turnDelta = -this.state.bankAngle * BANK_TURN_RATE * dt;
    heading.applyAxisAngle(normal, turnDelta);
    heading.addScaledVector(normal, -heading.dot(normal)).normalize();

    // --- Forward movement ---
    const right = new THREE.Vector3().crossVectors(heading, normal).normalize();
    const movementForward = heading.clone()
      .applyAxisAngle(right, this.state.pitchAngle)
      .normalize();
    this.state.position.addScaledVector(movementForward, this.state.speed * dt);
    if (GLIDE_SINK_RATE > 0) {
      this.state.position.addScaledVector(toCenter, GLIDE_SINK_RATE * dt);
    }

    // Recalculate altitude after all position changes
    const newNormal = this.state.position.clone().normalize();
    const newSurfaceRadius = PLANET_RADIUS + this.getTerrainHeight(newNormal);
    const newAlt = this.state.position.length() - newSurfaceRadius;

    if (newAlt < MIN_FLIGHT_ALTITUDE) {
      this.state.position.copy(
        newNormal.multiplyScalar(newSurfaceRadius + MIN_FLIGHT_ALTITUDE),
      );
      this.state.altitude = MIN_FLIGHT_ALTITUDE;
    } else {
      this.state.altitude = newAlt;
    }

    this.resolveObstacleCollisions();

    const surfaceUp = this.state.position.clone().normalize();
    heading.addScaledVector(surfaceUp, -heading.dot(surfaceUp)).normalize();
    const visualRight = new THREE.Vector3().crossVectors(heading, surfaceUp).normalize();
    const visualForward = heading.clone()
      .applyAxisAngle(visualRight, this.state.pitchAngle)
      .normalize();
    this.state.rotation.copy(
      buildSurfaceAlignedRotation(visualForward, surfaceUp, this.state.bankAngle),
    );
  }

  private resolveObstacleCollisions() {
    const planeRadius = 0.8;

    for (const obstacle of this.collisionObstacles) {
      const offset = this.state.position.clone().sub(obstacle.center);
      const minDistance = obstacle.radius + planeRadius;
      const distanceSq = offset.lengthSq();

      if (distanceSq >= minDistance * minDistance) continue;

      if (distanceSq < 0.0001) {
        offset.copy(this.state.position).normalize();
      } else {
        offset.normalize();
      }

      this.state.position.copy(
        obstacle.center.clone().addScaledVector(offset, minDistance),
      );
      this.state.speed = Math.max(MIN_SPEED, this.state.speed * 0.45);
    }
  }

  reset() {
    const startNormal = new THREE.Vector3(0, 1, 0);
    const startSurfaceRadius = PLANET_RADIUS + this.getTerrainHeight(startNormal);
    this.state.position.copy(
      startNormal.multiplyScalar(startSurfaceRadius + INITIAL_FLIGHT_ALTITUDE),
    );
    this.state.rotation.identity();
    this.state.altitude = INITIAL_FLIGHT_ALTITUDE;
    this.state.speed = BASE_SPEED;
    this.state.bankAngle = 0;
    this.state.pitchAngle = 0;
  }
}
