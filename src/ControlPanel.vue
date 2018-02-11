<template>
  <div id='control-panel'>
    <h1>Controls</h1>
    <div class='panel'>
      <h2>Date</h2>
      <div>date {{currentTime}}</div>
      <div>julian {{currentJulian | round(2)}}</div>
      <div>centuries past J2000 {{currentCenturiesPastJ2000 | round(5)}}</div>
    </div>
    <div class='panel'>
      <h2>Camera</h2>
      <div>position</div>
      <div>x: {{currentPosition.x | round(5)}}</div>
      <div>y: {{currentPosition.y | round(5)}}</div>
      <div>z: {{currentPosition.z | round(5)}}</div>
      <div>target</div>
      <div>x: {{currentTarget.x | round(5)}}</div>
      <div>y: {{currentTarget.y | round(5)}}</div>
      <div>z: {{currentTarget.z | round(5)}}</div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'ControlPanel',
  computed: {
    currentTime: function() {
      return this.$store.getters.clockDate
    },
    currentJulian: function() {
      return this.$store.getters.clockJulian
    },
    currentCenturiesPastJ2000: function() {
      return this.$store.getters.clockCenturiesPastJ2000
    },
    currentTarget: function() {
      return this.$store.getters.target
    },
    currentPosition: function() {
      return this.$store.getters.position
    }
  }
}
</script>

<style scoped>
  #control-panel {
    width: 300px;
    background-color: #12181f;
    color: white;
    padding: 10px;
  }
</style>