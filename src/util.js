const AU_TO_METERS = 149597870700
const DEG_TO_RADIANS = 0.0174533
const CIRCLE_RADIANS = (Math.PI * 2)

export class Util {

  static auToMeters(au) {
    return au * AU_TO_METERS
  }

  static degreesToRadians(degrees) {
    return degrees * DEG_TO_RADIANS
  }

  static modRadiansToCircle(radians) {
    return radians % CIRCLE_RADIANS
  }
}
