<template>
  <div
    v-if="shouldDisplay"
    :style="objectStyle"
    class="overlay-object"
  >
    <div
      class="overlay-label"
      @click="selectTargetObjectName(object.name)"
    >
      {{object.name}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverlayObject',
  props: {
    object: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    shouldDisplay: function() {
      return this.object.position2D && this.object.position2D.dist > 0.5
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
      }
    }
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
  .overlay-object:hover {
    border-color: red;
  }
  .overlay-label {
    pointer-events: auto;
  }
</style>