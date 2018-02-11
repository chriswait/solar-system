import {AU_TO_METERS, DEG_TO_RADIANS, CIRCLE_RADIANS} from './constants'

export function auToMeters(au) {
  return au * AU_TO_METERS
}

export function degreesToRadians(degrees) {
  return degrees * DEG_TO_RADIANS
}
export function radiansToDegrees(radians) {
  return radians * (1/DEG_TO_RADIANS)
}

export function modRadiansToCircle(radians) {
  radians = radians %= CIRCLE_RADIANS
  if (radians < 0) radians += CIRCLE_RADIANS
  return radians
}
