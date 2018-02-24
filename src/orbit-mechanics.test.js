import SolarSystemData from './data/solar-system.json'
import {OrbitMechanics} from './orbit-mechanics'
import {degreesToRadians} from './util'

describe('can solve eccentric anomaly', function() {
  it ('e=0.5, M=27 deg', function() {
    expect(
      OrbitMechanics.getEccentricAnomaly(0.5, degreesToRadians(27))
    ).toBeCloseTo(
      degreesToRadians(48.43418)
    )
  })
  it ('e=1.0, M=90 deg', function() {
    expect(
      OrbitMechanics.getEccentricAnomaly(1, degreesToRadians(90))
    ).toBeCloseTo(
      degreesToRadians(132.34646)
    )
  })
  it ('e=0.1, M=180 deg', function() {
    expect(
      OrbitMechanics.getEccentricAnomaly(0.1, degreesToRadians(180))
    ).toBeCloseTo(
      degreesToRadians(180)
    )
  })
})

describe('can get elements at date', function() {
  it('earth at J2000', function() {
    let keplerianElements = SolarSystemData.objects[3].orbit.keplerianElements
    let newElements = OrbitMechanics.getElementsAtCenturiesPastJ2000(keplerianElements, 0)

    // time should be 0
    expect(newElements.time).toBe(0)
    // 6 orbital parameters should be unchanged
    expect(newElements.semiMajorAxisAu).toBe(keplerianElements.initial.semiMajorAxisAu)
    expect(newElements.eccentricityRadians).toBe(keplerianElements.initial.eccentricityRadians)
    expect(newElements.inclinationDegrees).toBe(keplerianElements.initial.inclinationDegrees)
    expect(newElements.meanLongitudeDegrees).toBe(keplerianElements.initial.meanLongitudeDegrees)
    expect(newElements.periapsisLongitudeDegrees).toBe(keplerianElements.initial.periapsisLongitudeDegrees)
    expect(newElements.ascendingNodeLongitudeDegrees).toBe(keplerianElements.initial.ascendingNodeLongitudeDegrees)
    // computed parameters
    expect(newElements.eccentricAnomalyRadians).toBe(6.239288029779582)
    expect(newElements.meanAnomalyRadians).toBe(6.240021371704195)
    expect(newElements.ascendingNodeLongitudeRadians).toBe(0)
    expect(newElements.inclinationRadians).toBe(6.283185039969563)
    expect(newElements.periapsisArgumentRadians).toBe(1.7966022440288691)
  })
  it('earth at J2100', function() {
    let keplerianElements = SolarSystemData.objects[3].orbit.keplerianElements
    let newElements = OrbitMechanics.getElementsAtCenturiesPastJ2000(keplerianElements, 1)

    // time should be 1
    expect(newElements.time).toBe(1)
    // 6 orbital parameters should have increased by their rates
    expect(newElements.semiMajorAxisAu).toBe(keplerianElements.initial.semiMajorAxisAu + keplerianElements.rates.semiMajorAxisAu)
    expect(newElements.eccentricityRadians).toBe(keplerianElements.initial.eccentricityRadians + keplerianElements.rates.eccentricityRadians)
    expect(newElements.inclinationDegrees).toBe(keplerianElements.initial.inclinationDegrees + keplerianElements.rates.inclinationDegrees)
    expect(newElements.meanLongitudeDegrees).toBe(keplerianElements.initial.meanLongitudeDegrees + keplerianElements.rates.meanLongitudeDegrees)
    expect(newElements.periapsisLongitudeDegrees).toBe(keplerianElements.initial.periapsisLongitudeDegrees + keplerianElements.rates.periapsisLongitudeDegrees)
    expect(newElements.ascendingNodeLongitudeDegrees).toBe(keplerianElements.initial.ascendingNodeLongitudeDegrees + keplerianElements.rates.ascendingNodeLongitudeDegrees)
    // computed parameters
    expect(newElements.eccentricAnomalyRadians).toBe(6.222687926553071)
    expect(newElements.meanAnomalyRadians).toBe(6.223695640193505)
    expect(newElements.ascendingNodeLongitudeRadians).toBe(0)
    expect(newElements.inclinationRadians).toBe(6.28295907767952)
    expect(newElements.periapsisArgumentRadians).toBe(1.802244435849881)
  })
})