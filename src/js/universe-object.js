export class UniverseObject {
  name;
  radius;
  color;
  orbit;
  orbits;
  mesh;
  constructor(object) {
    for (let key of Object.keys(object)) {
      if (object[key]) {
        this[key] = object[key];
      }
    }
  }
}
