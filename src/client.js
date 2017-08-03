import storage from 'local-storage-fallback';
import {
  Client as CoreClient,
  isDefined,
  CacheRack,
  NetworkRack
} from 'kinvey-js-sdk';
import { CacheMiddleware, HttpMiddleware } from './middleware';

class ActiveUserStorage {
  get(key) {
    try {
      return JSON.parse(storage.getItem(key));
    } catch (e) {
      return null;
    }
  }

  set(key, value) {
    if (isDefined(value)) {
      storage.setItem(key, JSON.stringify(value));
    } else {
      storage.removeItem(key);
    }

    return value;
  }
}

export class Client extends CoreClient {
  static init(config) {
    CacheRack.useCacheMiddleware(new CacheMiddleware());
    NetworkRack.useHttpMiddleware(new HttpMiddleware());

    const client = super.init(config);
    client.activeUserStorage = new ActiveUserStorage();
    return client;
  }
}
