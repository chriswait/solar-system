<template>
  <canvas id='solar-system-canvas'></canvas>
</template>

<script>
import OrbitControls from './orbit-controls'
import {Screen} from './screen'
import {FRAME_RATE} from './constants'

export default {
  name: 'Visualizer',
  computed: {
    objects: function() {
      return this.$store.getters.objects
    },
    lastObject: function() {
      let objects = this.$store.getters.objects
      return objects[objects.length - 1]
    },
    currentTargetPosition: function() {
      return this.$store.getters.currentTargetPosition
    }

  },
  mounted() {
    let canvasElement = document.getElementById('solar-system-canvas')
    this.screen = new Screen()
    this.screen.initRenderer(canvasElement)
    this.screen.setScaleForOuterObject(this.lastObject)

    this.controls = new OrbitControls(this.screen.camera, canvasElement)
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
      this.$store.dispatch('updatePositions')

      this.objects.forEach((object) => {
        this.screen.redrawObject(object)
      })
      if (this.currentTargetPosition) {
        this.controls.target.copy(this.screen.scaleRealToVisualised(this.currentTargetPosition))
      }
      this.controls.update()
      this.screen.render()
      if (this.screen.camera) this.$store.commit('setCameraPosition', this.screen.camera.position)

      setTimeout(() => {
        requestAnimationFrame(this.render.bind(this))
      }, FRAME_RATE)
    }
  }
}
</script>

<style scoped>
  #solar-system-canvas {
    width: 100%;
    height: 100%;
  }
</style>
