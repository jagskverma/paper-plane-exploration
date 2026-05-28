import type { FlightInput } from "./FlightInput";
import { neutralInput } from "./FlightInput";

/**
 * Bridges raw DOM input events (mouse, keyboard) to the abstract
 * FlightInput format consumed by the flight system.
 *
 * Subscribes to events on a target element (the canvas).
 * Call `start()` to begin listening, `stop()` to clean up,
 * and `read()` each frame to get the current input state.
 */
export class InputManager {
  private state: FlightInput = neutralInput();
  private target: HTMLElement | null = null;
  private running = false;

  // Bound handlers for cleanup
  private onMouseMove = (e: MouseEvent) => {
    if (!this.target) return;
    const rect = this.target.getBoundingClientRect();
    // Normalize mouse position to [-1, 1] relative to center
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    this.state.bank = clamp(((e.clientX - cx) / (rect.width / 2)) * 0.8, -1, 1);
    this.state.pitch = clamp(-((e.clientY - cy) / (rect.height / 2)) * 0.6, -1, 1);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.state.throttle = 1;
        break;
      case "KeyS":
      case "ArrowDown":
        this.state.throttle = -1;
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
      case "KeyS":
      case "ArrowDown":
        this.state.throttle = 0;
        break;
    }
  };

  private onMouseLeave = () => {
    // Return to neutral when mouse leaves the canvas
    this.state.bank = 0;
    this.state.pitch = clamp(this.state.pitch, -0.3, 0.3); // gentle return
  };

  start(target: HTMLElement) {
    if (this.running) return;
    this.target = target;
    target.addEventListener("mousemove", this.onMouseMove);
    target.addEventListener("mouseleave", this.onMouseLeave);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.running = true;
  }

  stop() {
    if (!this.running || !this.target) return;
    this.target.removeEventListener("mousemove", this.onMouseMove);
    this.target.removeEventListener("mouseleave", this.onMouseLeave);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.target = null;
    this.running = false;
  }

  /** Returns the current input snapshot. Call each frame. */
  read(): FlightInput {
    return { ...this.state };
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
