/**
 * Input action types — what the flight system consumes.
 * Decoupled from specific devices (keyboard, mouse, controller, touch).
 */
export interface FlightInput {
  /** -1 (full left) to 1 (full right). Controls roll/bank. */
  bank: number;
  /** -1 (nose down) to 1 (nose up). Controls pitch. */
  pitch: number;
  /** -1 (dive/brake) to 1 (boost). Controls speed modifier. */
  throttle: number;
  /** Test-only speed boost. Gated by world config before input sets it. */
  speedBoost: boolean;
}

/**
 * Creates default neutral input (no movement).
 */
export function neutralInput(): FlightInput {
  return { bank: 0, pitch: 0, throttle: 0, speedBoost: false };
}
