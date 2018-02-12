<template>
  <div id='container'>
    <canvas id='solar-system-canvas'></canvas>
    <control-panel></control-panel>
  </div>
</template>

<script>
import OrbitControls from './orbit-controls'
import {Screen} from './screen'
import {Universe} from './universe'
import ControlPanel from './ControlPanel'
import {FRAME_RATE} from './constants'

export default {
  name: 'App',
  components: {
    ControlPanel
  },
  computed: {
    objects: function() {
      return this.$store.getters.objects
    },
    lastObject: function() {
      return this.objects[this.objects.length - 1]
    }
  },
  created: function() {
    this.universe = new Universe()
  },
  mounted() {
    this.screen = new Screen()
    this.screen.initRenderer()
    this.screen.setScaleForOuterObject(this.lastObject)
    this.controls = new OrbitControls(this.screen.camera)
    this.controls.target.set(0, 0, 0)
    this.objects.forEach((object) => {
      this.screen.drawObject(object)
      if (object.star) {
        this.screen.drawLightForObject(object)
      }
      if (object.orbit) {
        this.screen.drawOrbitForObject(object)
      }
    })
    requestAnimationFrame(this.render.bind(this))
  },
  methods: {
    render() {
      this.$store.commit('tick')
      this.universe.updatePositions()

      this.objects.forEach((object) => {
        this.screen.redrawObject(object)
        // if (object.name === 'earth') {
        //   this.controls.target.copy(this.screen.scaleRealToVisualised(object.position))
        // }
      })
      this.controls.update()
      this.screen.render()
      if (this.controls) this.$store.commit('setTarget', this.controls.target)
      if (this.screen.camera) this.$store.commit('setPosition', this.screen.camera.position)

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