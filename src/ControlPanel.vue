<template>
  <div id='control-panel'>
    <div id='control-panel-content'>
      <h1>Controls</h1>
      <div class='panel'>
        <h2>Clock</h2>
        <div>date {{date}}</div>
        <div>julian {{julianDate | round(2)}}</div>
        <div>centuries past J2000 {{centuriesPastJ2000 | round(5)}}</div>
        <div>rate {{clockRateSeconds}}</div>
      </div>
      <div class='panel'>
        <h2>Camera</h2>
        <div v-if='position'>
          <h3>position</h3>
          <div>x: {{position.x | round(5)}}</div>
          <div>y: {{position.y | round(5)}}</div>
          <div>z: {{position.z | round(5)}}</div>
        </div>
        <div v-if='target'>
          <h3>target</h3>
          <div>x: {{target.x | round(5)}}</div>
          <div>y: {{target.y | round(5)}}</div>
          <div>z: {{target.z | round(5)}}</div>
        </div>
      </div>
      <div class='panel'>
        <h2>Objects</h2>
        <div v-for='object of objects' :key='object.name'>
          <span>{{object.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlPanel',
  filters: {
    round: (value, decimals) => {
      if(!value) {
        value = 0;
      }
      if(!decimals) {
        decimals = 0;
      }
      value = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
      return value;
    }
  },
  computed: {
    date: function() {
      return this.$store.getters.currentDate
    },
    julianDate: function() {
      return this.$store.getters.julianDate
    } ,
    centuriesPastJ2000: function() {
      return this.$store.getters.centuriesPastJ2000
    },
    clockRateSeconds: function() {
      return this.$store.getters.clockRateSeconds
    },
    target: function() {
      return this.$store.getters.target
    },
    position: function() {
      return this.$store.getters.position
    },
    objects: function() {
      return this.$store.getters.objects
    },
  }
}
</script>

<style scoped>
  #control-panel {
    width: 300px;
    height: 100vh;
    background-color: #12181f;
    color: white;
    overflow-y: scroll;
  }
  #control-panel-content {
    padding: 10px;
  }
</style>