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
        <div v-if='cameraPosition'>
          <h3>cameraPosition</h3>
          <div>x: {{cameraPosition.x | round(5)}}</div>
          <div>y: {{cameraPosition.y | round(5)}}</div>
          <div>z: {{cameraPosition.z | round(5)}}</div>
        </div>
        <div v-if='targetName'>
          <h3>target</h3>
          <div>{{targetName}}</div>
          <div v-if='targetPosition'>
            <div>x: {{targetPosition.x | round(5)}}</div>
            <div>y: {{targetPosition.y | round(5)}}</div>
            <div>z: {{targetPosition.z | round(5)}}</div>
          </div>
        </div>
      </div>
      <div class='panel'>
        <h2>Objects</h2>
        <div v-for='object of objects' :key='object.name'>
          <span v-on:click='selectTargetObjectName(object.name)'>{{object.name}}</span>
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
    targetName: function() {
      return this.$store.getters.currentTargetName
    },
    targetPosition: function() {
      return this.$store.getters.currentTargetPosition
    },
    cameraPosition: function() {
      return this.$store.getters.currentCameraPosition
    },
    objects: function() {
      return this.$store.getters.objects
    },
  },
  methods: {
    selectTargetObjectName(objectName) {
      this.$store.commit('setTargetName', objectName)
    }
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