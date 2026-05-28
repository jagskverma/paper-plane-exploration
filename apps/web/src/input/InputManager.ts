import type { FlightInput } from "./FlightInput";
import { neutralInput } from "./FlightInput";

/**
 * Arrow-key input mapped to airplane controls.
 * Up    = pitch nose up
 * Down  = pitch nose down
 * Left  = bank left (turn left)
 * Right = bank right (turn right)
 */
export class InputManager {
  private state: FlightInput = neutralInput();
  private running = false;

  private keys = new Set<string>();

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code);
    this.updateState();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
    this.updateState();
  };

  private updateState() {
    // Up = nose up (throttle), Down = nose down (pitch)
    this.state.throttle = this.keys.has("ArrowUp") ? 1 : 0;
    this.state.pitch = this.keys.has("ArrowDown") ? 1 : 0;
    this.state.bank = 0;
    if (this.keys.has("ArrowLeft")) this.state.bank = -1;
    if (this.keys.has("ArrowRight")) this.state.bank = 1;
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
    return { ...this.state };
  }
}
