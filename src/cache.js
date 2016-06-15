import { CacheMiddleware as CoreCacheMiddelware, DB as CoreDB } from 'kinvey-javascript-sdk-core/es5/rack/middleware/cache';
import { KinveyError } from 'kinvey-javascript-sdk-core/es5/errors';
import { Log } from 'kinvey-javascript-sdk-core/es5/log';
import { LocalStorage, SessionStorage } from './webstorage';
import { IndexedDB } from './indexeddb';
import { WebSQL } from './websql';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
const dbCache = {};

/**
 * Enum for DB Adapters.
 */
const DBAdapter = {
  IndexedDB: 'IndexedDB',
  LocalStorage: 'LocalStorage',
  SessionStorage: 'SessionStorage',
  WebSQL: 'WebSQL'
};
Object.freeze(DBAdapter);
export { DBAdapter };

export class DB extends CoreDB {
  constructor(name = 'kinvey', adapters = [
    DBAdapter.IndexedDB,
    DBAdapter.WebSQL,
    DBAdapter.LocalStorage,
    DBAdapter.SessionStorage
  ]) {
    super(name);

    if (!name) {
      throw new KinveyError('A name was not provided when creating a DB instance.');
    }

    if (!isString(name)) {
      throw new KinveyError('The name provided when creating a DB instance is not a string.');
    }

    if (!isArray(adapters)) {
      adapters = [adapters];
    }

    forEach(adapters, adapter => {
      switch (adapter) {
        case DBAdapter.IndexedDB:
          if (IndexedDB.isSupported()) {
            this.adapter = new IndexedDB(name);
            return false;
          }

          break;
        case DBAdapter.LocalStorage:
          if (LocalStorage.isSupported()) {
            this.adapter = new LocalStorage(name);
            return false;
          }

          break;
        case DBAdapter.SessionStorage:
          if (SessionStorage.isSupported()) {
            this.adapter = new SessionStorage(name);
            return false;
          }

          break;
        case DBAdapter.WebSQL:
          if (WebSQL.isSupported()) {
            this.adapter = new WebSQL(name);
            return false;
          }

          break;
        default:
          Log.warn(`The ${adapter} adapter is is not recognized.`);
      }

      return true;
    });

    // if (!this.adapter) {
    //   Log.error('Provided adapters are unsupported on this platform.'
    //     + ' Defaulting to the Memory adapter.', adapters);
    //   this.adapter = new Memory(name);
    // }
  }
}

export class CacheMiddleware extends CoreCacheMiddelware {
  getDB(request, adapters = [
    DBAdapter.IndexedDB,
    DBAdapter.WebSQL,
    DBAdapter.LocalStorage,
    DBAdapter.SessionStorage
  ]) {
    if (!request) {
      throw new KinveyError('Unable to provide a DB instance since no request was provided.');
    }

    const { appKey } = request;

    if (!appKey) {
      throw new KinveyError('Unable to provide a DB instance since the request provided does not contain an appKey.');
    }

    let db = dbCache[appKey];

    if (!db) {
      db = new DB(appKey, adapters);
    }

    return db;
  }
}
