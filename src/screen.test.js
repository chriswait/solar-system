import {Screen} from './screen'
import {Vector3} from 'three'
import {auToMeters} from './util'

let screen

describe('screen', function() {
  describe('should scale at default of 1', function() {
    beforeEach(function() {
      screen = new Screen()
    })
    it('0, 0, 0', function() {
      expect(
        screen.scaleRealToVisualised(new Vector3(0, 0, 0))
      ).toEqual(
        new Vector3(0, 0, 0)
      )
    })
    it('1, 1, 1', function() {
      expect(
        screen.scaleRealToVisualised(new Vector3(1, 1, 1))
      ).toEqual(
        new Vector3(1, 1, 1)
      )
    })
  })
  describe('should scale correctly with scaleFactor set', function() {
    beforeEach(function() {
      screen = new Screen()
      let lastObject = {
        orbit: {
          keplerianElements: {
            initial: {
              semiMajorAxisAu: 1
            }
          }
        }
      }
      screen.setScaleForOuterObject(lastObject)
    })
    it('0, 0, 0', function() {
      expect(
        screen.scaleRealToVisualised(new Vector3(0, 0, 0))
      ).toEqual(
        new Vector3(0, 0, 0)
      )
    })
    it('1, 1, 1', function() {
      let scaledDistance = 500 / auToMeters(1)
      expect(
        screen.scaleRealToVisualised(new Vector3(1, 1, 1))
      ).toEqual(
        new Vector3(scaledDistance, scaledDistance, scaledDistance)
      )
    })
  })
})