import {Vector3} from 'three'
import {UniverseObject} from './universe-object'
import SolarSystemData from './data/solar-system.json'

let sunDictionary = SolarSystemData.objects[0]
let earthDictionary = SolarSystemData.objects[3]

describe('should load objects correctly', function() {
  it('earth', function() {
    let universeObject = new UniverseObject(earthDictionary)
    expect(universeObject.name).toBe('earth')
    expect(universeObject.orbit).toBeDefined()
    expect(universeObject.star).toBeFalsy()
  })
  it('sun', function() {
    let universeObject = new UniverseObject(sunDictionary)
    expect(universeObject.name).toBe('sun')
    expect(universeObject.orbit).toBeUndefined()
    expect(universeObject.star).toBeTruthy()
  })
})
describe('should return position at centuries', function() {
  it('earth at J2000', function() {
    let universeObject = new UniverseObject(earthDictionary)
    let position = universeObject.getPositionAtCenturiesPastJ2000(0)
    expect(typeof(position)).toEqual('object')
    expect(typeof(position.x)).toEqual('number')
  })
  it('sun', function() {
    let universeObject = new UniverseObject(sunDictionary)
    let position = universeObject.getPositionAtCenturiesPastJ2000(0)
    expect(typeof(position)).toEqual('object')
    expect(typeof(position.x)).toEqual('number')
    expect(position.x).toEqual(0)
  })
})