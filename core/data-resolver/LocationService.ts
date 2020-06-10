import { DataResolver } from './types/DataResolver';
import Task from "core/lib/sync/types/Task";
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import config from 'config';

const getStores = async (lat, lng): Promise<Task> => {
  try {
    let url = `${config.location.endpoint}?lat=${lat}&lng=${lng}`;
    const task = await TaskQueue.execute({ url, // sync the cart
      payload: {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      },
    });
    return task;
  } catch (err) {
    console.error(err);
  }
}

export const LocationService: DataResolver.LocationService = {
  getStores
};
