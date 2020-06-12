import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import LocationState from '../types/LocationState';

export const LocationStore: Module<LocationState, any> = {
  namespaced: true,
  state: {
    location: {
      latitude: null,
      longitude: null
    }
  },
  getters,
  actions,
  mutations
};
