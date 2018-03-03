<template>
  <div id="visualizer-container">
    <canvas id="solar-system-canvas"/>
    <div id="overlay">
      <overlay-object
        v-for="object of objects"
        :key="object.name"
        :object="object"
      />
    </div>
  </div>
</template>

<script>
import OverlayObject from './OverlayObject'

import OrbitControls from './orbit-controls'
import {Screen} from './screen'
import {FRAME_RATE} from './constants'

export default {
  name: 'Visualizer',
  components: {
    'overlay-object': OverlayObject
  },
  computed: {
    objects: function() {
      return this.$store.getters.objects
    },
    lastObject: function() {
      let objects = this.$store.getters.objects
      return objects[objects.length - 1]
    }
  },
  created() {
    this.screen = new Screen()
  },
  mounted() {
    let canvasElement = document.getElementById('solar-system-canvas')
    this.screen.initRenderer(canvasElement)
    this.screen.setScaleForOuterObject(this.lastObject)
    this.controls = new OrbitControls(this.screen.camera, canvasElement)

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
      this.$store.dispatch('updateLastOrbits')

      this.objects.forEach((object) => {
        this.screen.redrawObject(object)
        if (object.lastOrbit) {
          this.screen.redrawOrbitForObject(object)
        }
      })

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
  #visualizer-container {
    position: relative;
  }
  #visualizer-container,
  #solar-system-canvas {
    width: 100%;
    height: 100vh;
  }
</style>
