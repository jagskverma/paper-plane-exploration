import type { FlightInput } from "./FlightInput";
import { neutralInput } from "./FlightInput";

/**
 * Keyboard-only input manager. Arrow keys control the plane directly.
 * No mouse — simple, direct movement.
 */
export class InputManager {
  private state: FlightInput = neutralInput();
  private running = false;

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":    this.state.throttle = 1; break;
      case "ArrowDown":  this.state.pitch = -1; break;
      case "ArrowLeft":  this.state.bank = -1; break;
      case "ArrowRight": this.state.bank = 1; break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":    this.state.throttle = 0; break;
      case "ArrowDown":  this.state.pitch = 0; break;
      case "ArrowLeft":
      case "ArrowRight": this.state.bank = 0; break;
    }
  };

  start(_target: HTMLElement) {
    if (this.running) return;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.running = true;
  }

  stop() {
    if (!this.running) return;
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.running = false;
  }

  read(): FlightInput {
    return { ...this.state };
  }
}
