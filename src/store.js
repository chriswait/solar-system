import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    clock: null,
    objects: [],
    target: null,
    position: null,
  },
  mutations: {
    setClock: (state, clock) => {
      state.clock = clock
    },
    tickClock: (state) => {
      state.clock.tick()
    },
    setTarget: (state, target) => {
      state.target = Object.assign({}, target)
    },
    setPosition: (state, position) => {
      state.position = Object.assign({}, position)
    },
  },
  getters: {
    clockDate: (state) => {
      return state.clock.date
    },
    clockJulian: (state) => {
      return state.clock.currentJulianDate
    },
    clockCenturiesPastJ2000: (state) => {
      return state.clock.currentCenturiesPastJ2000
    },
    target: (state) => {
      return state.target
    },
    position: (state) => {
      return state.position
    },
  }
})

export default store