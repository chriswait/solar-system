import Vue from 'vue'
import Vuex from 'vuex'

import {Clock} from './clock'
import {INITIAL_CLOCK_RATE_SECONDS} from './constants'
import {UniverseObject} from './universe-object'

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
    objects: (state) => state.universeObjects,
    objectWithName: (state) => {
      return name => {
        return state.universeObjects.find((ob) => ob.name === name)
      }
    }
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
    setPositionForObject: (state, {object, position}) => {
      let match = state.universeObjects.find((ob) => ob.name === object.name)
      Vue.set(match, 'position', position)
    },
    setLastOrbitForObject: (state, {object, positions}) => {
      let match = state.universeObjects.find((ob) => ob.name === object.name)
      Vue.set(match, 'lastOrbit', positions)
    },
    setPosition2DForObject: (state, {object, position2D}) => {
      let match = state.universeObjects.find((ob) => ob.name === object.name)
      Vue.set(match, 'position2D', position2D)
    }
  },
  actions: {
    loadUniverseObjects: (context, solarSystemData) => {
      let objects = solarSystemData.objects.map((solarSystemObject) => new UniverseObject(solarSystemObject))
      context.commit('setObjects', objects)
    },
    updatePositions: (context) => {
      let centuries = context.getters.centuriesPastJ2000
      context.getters.objects.forEach((object) => {
        context.commit('setPositionForObject', {
          object: object,
          position: object.getPositionAtCenturiesPastJ2000(centuries)
        })
      })
    },
    updateLastOrbits: (context) => {
      let centuries = context.getters.centuriesPastJ2000
      context.getters.objects.forEach((object) => {
        context.commit('setLastOrbitForObject', {
          object: object,
          positions: object.getLastOrbitAtCenturiesPastJ2000(centuries)
        })
      })
    }
  }
})

export default store