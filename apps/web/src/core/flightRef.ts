import type { FlightController } from "../flight/FlightController";

/** Shared ref so UI outside Canvas can read flight state. */
export const flightControllerRef: { current: FlightController | null } = {
  current: null,
};
