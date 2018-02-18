<template>
  <div id='visualizer-container'>
    <canvas id='solar-system-canvas'></canvas>
    <div id='overlay'>
      <div
        class='overlay-object'
        v-for='object of objects'
        :key='object.name'
        v-if='object.position2D'
        v-on:click='selectTargetObjectName(object.name)'
        v-bind:style='{
          left: object.position2D.x + "px",
          top: object.position2D.y + "px",
          width: object.position2D.dist + "px",
          height: object.position2D.dist + "px"
        }'
      >
        {{object.name}}
      </div>
    </div>
  </div>
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
    },
    selectTargetObjectName(objectName) {
      this.$store.commit('setTargetName', objectName)
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
    height: 100%;
  }
  .overlay-object {
    position: absolute;
    color: white;
    border-radius: 50%;
    border: 3px solid skyblue;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>
