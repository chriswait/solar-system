const AU_TO_METERS = 149597870700
const DEG_TO_RADIANS = 0.0174533
const CIRCLE_RADIANS = (Math.PI * 2)

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
