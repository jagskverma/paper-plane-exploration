import type { FlightInput } from "./FlightInput";
import { neutralInput } from "./FlightInput";
import { ENABLE_TEST_SPEED_BOOST } from "../core/worldConfig";

/**
 * Arrow-key + WASD input mapped to airplane controls.
 * ArrowUp / W    = pitch nose up
 * ArrowDown / S  = pitch nose down
 * ArrowLeft / A  = bank left (turn left)
 * ArrowRight / D = bank right (turn right)
 */
export class InputManager {
  private state: FlightInput = neutralInput();
  private running = false;
  private speedBoostUntil = 0;

  private keys = new Set<string>();

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code.startsWith("Arrow") || e.code === "Space" || 
        e.code === "KeyW" || e.code === "KeyA" || e.code === "KeyS" || e.code === "KeyD") {
      e.preventDefault();
    }
    if (e.code === "Space" && ENABLE_TEST_SPEED_BOOST) {
      this.speedBoostUntil = performance.now() + 700;
    }
    this.keys.add(e.code);
    this.updateState();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.code.startsWith("Arrow") || e.code === "Space" ||
        e.code === "KeyW" || e.code === "KeyA" || e.code === "KeyS" || e.code === "KeyD") {
      e.preventDefault();
    }
    this.keys.delete(e.code);
    this.updateState();
  };

  private updateState() {
    // Pitch: ArrowUp or W = nose up, ArrowDown or S = nose down
    this.state.throttle = (this.keys.has("ArrowUp") || this.keys.has("KeyW")) ? 1 : 0;
    this.state.pitch = (this.keys.has("ArrowDown") || this.keys.has("KeyS")) ? 1 : 0;
    // Bank: ArrowLeft or A = left, ArrowRight or D = right
    this.state.bank = 0;
    if (this.keys.has("ArrowLeft") || this.keys.has("KeyA")) this.state.bank = -1;
    if (this.keys.has("ArrowRight") || this.keys.has("KeyD")) this.state.bank = 1;
    this.state.speedBoost = ENABLE_TEST_SPEED_BOOST && (
      this.keys.has("Space") ||
      performance.now() < this.speedBoostUntil
    );
  }

  start(_target: HTMLElement) {
    if (this.running) return;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.running = true;
  }

  stop() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.running = false;
  }

  read(): FlightInput {
    this.updateState();
    return { ...this.state };
  }
}
