import {Vector3} from 'three'
import {UniverseObject} from './universe-object'
import SolarSystemData from './data/solar-system.json'

let earthDictionary, universeObject
describe('universe-object', function() {
  beforeEach(function() {
    earthDictionary = SolarSystemData.objects[3]
    universeObject = new UniverseObject(earthDictionary)
  })
  it('can load earth correctly', function() {
    expect(universeObject.name).toBe('earth')
  })
  it('can set position', function() {
    let newPosition = new Vector3(1, 1, 1)
    expect(universeObject.position).toBeUndefined()
    universeObject.setPosition(newPosition)
    expect(universeObject.position).toEqual(newPosition)
  })
  it('can update position', function() {
    let firstPosition = new Vector3(1, 1, 1)
    let secondPosition = new Vector3(2, 2, 2)
    universeObject.setPosition(firstPosition)
    expect(universeObject.position).toEqual(firstPosition)
    universeObject.setPosition(secondPosition)
    expect(universeObject.position).toEqual(secondPosition)
  })
})