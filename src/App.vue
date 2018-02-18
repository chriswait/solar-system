<template>
  <div id='container'>
    <visualizer></visualizer>
    <control-panel></control-panel>
  </div>
</template>

<script>
import SolarSystemData from './data/solar-system'

import Visualizer from './Visualizer'
import ControlPanel from './ControlPanel'

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