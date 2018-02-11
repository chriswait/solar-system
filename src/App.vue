<template>
  <div id='container'>
    <canvas id='solar-system-canvas'></canvas>
    <control-panel></control-panel>
  </div>
</template>

<script>
import SolarSystemData from './data/solar-system'
import OrbitControls from './orbit-controls'
import {Screen} from './screen'
import {Universe} from './universe'
import {Clock} from './clock'
import ControlPanel from './control-panel'

const FRAME_RATE = 50
// const CLOCK_RATE_SECONDS = (60 * 60 * 24 * 365) / FRAME_RATE
const CLOCK_RATE_SECONDS = (60 * 24 * 365) / FRAME_RATE
// const CLOCK_RATE_SECONDS = 1 / FRAME_RATE

export default {
  name: 'App',
  components: {
    ControlPanel
  },
  created: function() {
    this.clock = new Clock(new Date(), CLOCK_RATE_SECONDS)
    this.universe = new Universe(SolarSystemData.objects, this.clock)
    this.screen = new Screen()
    let lastObject = this.universe.objects[this.universe.objects.length-1]
    this.screen.setScaleForOuterObject(lastObject)
  },
  mounted() {
    this.screen.initRenderer()
    this.controls = new OrbitControls(this.screen.camera)
    this.controls.target.set(0, 0, 0)
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
  },
  methods: {
    render() {
      this.clock.tick()
      this.universe.updatePositions(this.clock.getCurrentCenturiesPastJ2000())
      this.universe.objects.forEach((object) => {
        this.screen.redrawObject(object)
      })
      this.controls.update()
      this.screen.render()
      setTimeout(() => {
        requestAnimationFrame(this.render.bind(this))
      }, FRAME_RATE)
    }
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
}

#container {
  display: flex;
  width: 100%;
}
#solar-system-canvas {
  width: 100%;
  height: 100%;
}
</style>