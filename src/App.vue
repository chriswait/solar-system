<template>
  <div id="container">
    <visualizer/>
    <control-panel/>
  </div>
</template>

<script>
import SolarSystemData from './data/solar-system'

import Visualizer from './Visualizer'
import ControlPanel from './ControlPanel'
import {FRAME_RATE} from './constants'

export default {
  name: 'App',
  components: {
    Visualizer,
    ControlPanel
  },
  computed: {
  },
  created: function() {
    this.$store.dispatch('loadUniverseObjects', SolarSystemData)
    this.tick()
    this.updatePositions()
    this.updateOrbits()
    setInterval(this.tick.bind(this), FRAME_RATE)
    setInterval(this.updatePositions.bind(this), FRAME_RATE * 2)
    setInterval(this.updateOrbits.bind(this), 60000)
  },
  methods: {
    tick() {
      this.$store.commit('tick')
    },
    updatePositions() {
      this.$store.dispatch('updatePositions')
    },
    updateOrbits() {
      this.$store.dispatch('updateLastOrbits')
    },
  }
}
</script>

<style>
html, body {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 0;
}

#container {
  display: flex;
  width: 100%;
}
</style>