import { GetterTree } from 'vuex'
import RootState from '@vue-storefront/core/types/RootState'
import LocationState from '../types/LocationState';

const getters: GetterTree<LocationState, RootState> = {
  getLocation: state => state.location
}

export default getters
