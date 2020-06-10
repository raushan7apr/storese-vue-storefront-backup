import {ActionTree} from 'vuex';
import RootState from 'core/types/RootState';
import * as types from './mutation-types';
import LocationState from '../types/LocationState';

const actions: ActionTree<LocationState, RootState> = {
  async fetchStores ({ commit }) {
    commit(types.GET_STORES, []);
  }
}

export default actions;
