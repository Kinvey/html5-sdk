import isString from 'lodash/isString';
import { Client as CoreClient, KinveyError, isDefined } from 'kinvey-js-sdk/dist/export';
import storage from 'local-storage-fallback';

class ActiveUserStorage {
  get(key) {
    if (!isString(key)) {
      throw new KinveyError('ActiveUserStorage key must be a string.');
    }

    try {
      return JSON.parse(storage.getItem(key));
    } catch (e) {
      return null;
    }
  }

  set(key, value) {
    if (!isString(key)) {
      throw new KinveyError('ActiveUserStorage key must be a string.');
    }

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
    const client = CoreClient.init(config);
    client.activeUserStorage = new ActiveUserStorage();
    return client;
  }
}
