import {UniverseObject} from './universe-object'
import SolarSystemData from './data/solar-system.json'

describe('universe-object', function() {
  it('can load earth correctly', function() {
    let earthDictionary = SolarSystemData.objects[3]
    let universeObject = new UniverseObject(earthDictionary)
    expect(universeObject.name).toBe('earth')
  })
})