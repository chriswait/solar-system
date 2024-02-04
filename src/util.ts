import { AU_TO_METERS, DEG_TO_RADIANS, CIRCLE_RADIANS } from "./constants";

export function auToMeters(au: number): number {
  return au * AU_TO_METERS;
}

export function degreesToRadians(degrees: number): number {
  return degrees * DEG_TO_RADIANS;
}
export function radiansToDegrees(radians: number): number {
  return radians * (1 / DEG_TO_RADIANS);
}

export function modRadiansToCircle(radians: number): number {
  radians = radians %= CIRCLE_RADIANS;
  if (radians < 0) radians += CIRCLE_RADIANS;
  return radians;
}
