import {Clock} from './clock'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    date: new Date,
    clockRateSeconds: 1000,
    clock: null,
    universeObjects: [],
    target: null,
    position: null,
  },
  mutations: {
    tick: (state) => {
      Vue.set(state, 'date', Clock.getDateAfterNextTick(state.date, state.clockRateSeconds))
    },
    setTarget: (state, target) => {
      state.target = Object.assign({}, target)
    },
    setPosition: (state, position) => {
      state.position = Object.assign({}, position)
    },
    setObjects: (state, objects) => {
      state.universeObjects = objects
    },
    setPositionForObject: (state, {position, object}) => {
      let match = state.universeObjects.find((ob) => ob.name === object.name)
      Vue.set(match, 'position', position)
    }
  },
  getters: {
    currentDate: (state) => state.date,
    julianDate: (state) => Clock.getJulianDate(state.date),
    centuriesPastJ2000: (state) => Clock.getCenturiesPastJ2000(state.date),
    target: (state) => state.target,
    position: (state) => state.position,
    objects: (state) => state.universeObjects
   }
})

export default store