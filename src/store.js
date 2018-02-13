import {Clock} from './clock'
import {INITIAL_CLOCK_RATE_SECONDS} from './constants'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {
    date: new Date,
    clockRateSeconds: INITIAL_CLOCK_RATE_SECONDS,
    clock: null,
    universeObjects: [],
    targetName: 'sun',
    cameraPosition: null,
  },
  mutations: {
    tick: (state) => {
      Vue.set(state, 'date', Clock.getDateAfterNextTick(state.date, state.clockRateSeconds))
    },
    setClockRateSeconds: (state, clockRateSeconds) => {
      state.clockRateSeconds = clockRateSeconds
    },
    setTargetName: (state, targetName) => {
      state.targetName = targetName
    },
    setCameraPosition: (state, position) => {
      state.cameraPosition = Object.assign({}, position)
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
    clockRateSeconds: (state) => state.clockRateSeconds,
    currentTargetName: (state) => state.targetName,
    currentTargetObject: (state) => {
      return state.universeObjects.find((ob) => ob.name === state.targetName)
    },
    currentTargetPosition: (state) => {
      let currentTargetObject = state.universeObjects.find((ob) => ob.name === state.targetName)
      if (currentTargetObject) {
        return Object.assign({}, currentTargetObject.position)
      }
    },
    currentCameraPosition: (state) => state.cameraPosition,
    objects: (state) => state.universeObjects
   }
})

export default store