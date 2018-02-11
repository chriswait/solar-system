<template>
  <div id='control-panel'>
    <h1>Controls</h1>
    <h2>Focus</h2>
    <span>date {{currentTime}}</span>
  </div>
</template>

<script>
export default {
  name: 'ControlPanel',
  computed: {
    currentTime: function() {
      return this.$store.getters.clockDate
    },
  }
}
</script>

<style scoped>
  #control-panel {
    width: 300px;
    background-color: #12181f;
    color: white;
  }
</style>