import { StorefrontModule } from '@vue-storefront/core/lib/modules';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { LocationStore } from './store'

export const LocationModule: StorefrontModule = function ({ store }) {
  StorageManager.init('location');
  store.registerModule('location', LocationStore);
}
