import * as types from '@vue-storefront/core/modules/cart/store/mutation-types'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { LocationService } from '@vue-storefront/core/data-resolver'

const methodsActions = {

  async getStores ({ getters, rootGetters, dispatch }) {
    const location = rootGetters['location/getLocation'];
    console.log(location);
  }
}

export default methodsActions
