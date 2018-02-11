import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    clock: null,
    objects: []
  },
  actions: {

  },
  mutations: {
    setClock: (state, clock) => {
      state.clock = clock
    },
    tickClock: (state) => {
      state.clock.tick()
    }
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
    }
  }
})

export default store