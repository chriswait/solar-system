import SolarSystemData from './data/solar-system'
import OrbitControls from './controls'
import {Screen} from './screen'
import {Universe} from './universe'
import {Clock} from './clock'

const FRAME_RATE = 50
// const CLOCK_RATE_SECONDS = (60 * 60 * 24 * 365) / FRAME_RATE
const CLOCK_RATE_SECONDS = (60 * 24 * 365) / FRAME_RATE
// const CLOCK_RATE_SECONDS = 1 / FRAME_RATE

export class App {
  screen
  controls
  clock
  universe
  lastClockTime
  constructor() {
    this.clock = new Clock(new Date(), CLOCK_RATE_SECONDS)
    this.universe = new Universe(SolarSystemData.objects, this.clock)
    this.screen = new Screen(this.universe)
    this.controls = new OrbitControls(this.screen.camera)
    this.controls.target.set(0, 0, 0)
  }
  init() {
    this.universe.objects.forEach((object) => {
      object.mesh = this.screen.drawObject(object)
      if (object.star) {
        object.star.mesh = this.screen.drawLightForObject(object)
      }
      if (object.orbit) {
        object.orbit.mesh = this.screen.drawOrbitForObject(object)
      }
    })

    requestAnimationFrame(this.render.bind(this))
  }

  render() {
    this.clock.tick()
    let currentTime = this.clock.getCurrentCenturiesPastJ2000()
    if (currentTime != this.lastClockTime) {
      this.universe.updatePositions()
      this.universe.objects.forEach((object) => {
        this.screen.redrawObject(object)
      })
      this.lastClockTime = currentTime
    }
    this.controls.update()
    this.screen.render()
    setTimeout(() => {
      requestAnimationFrame(this.render.bind(this))
    }, FRAME_RATE)
  }
}
