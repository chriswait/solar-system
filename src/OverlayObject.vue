<template>
  <div
    class='overlay-object'
    v-if='object.position2D && shouldDisplay'
    v-on:click='selectTargetObjectName(object.name)'
    v-bind:style='objectStyle'
  >
    {{object.name}}
  </div>
</template>

<script>
export default {
  name: 'OverlayObject',
  props: {
    object: Object
  },
  computed: {
    shouldDisplay: function() {
      return this.object.position2D.dist > 0.5
    },
    objectStyle: function() {
      let dist = this.object.position2D.dist
      let opacity = Math.min(1, dist / 2)
      return {
        left: this.object.position2D.x + "px",
        top: this.object.position2D.y + "px",
        width: this.object.position2D.side + "px",
        height: this.object.position2D.side + "px",
        opacity: opacity,
        // "border-color": `rgba(1, 1, 1, ${100 / this.object.position2D.dist})`
      }
    }
  },
  created() {
    console.log('create object')
  },
  mounted() {
    console.log('mount object')
  },
  methods: {
    selectTargetObjectName(objectName) {
      this.$store.commit('setTargetName', objectName)
    }
  }
}
</script>

<style scoped>
  .overlay-object {
    position: absolute;
    color: white;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    border-color: skyblue;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>