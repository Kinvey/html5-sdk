import {
  CacheMiddleware as CoreCacheMiddelware,
  DB as CoreDB
} from 'kinvey-javascript-sdk-core/dist/rack';
import { KinveyError } from 'kinvey-javascript-sdk-core/dist/errors';
import { Log } from 'kinvey-javascript-sdk-core/dist/utils';
import { LocalStorage, SessionStorage } from './storage';
import { IndexedDB } from './indexeddb';
import { WebSQL } from './websql';
import forEach from 'lodash/forEach';
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
  }
}

export class CacheMiddleware extends CoreCacheMiddelware {
  openDatabase(name) {
    if (!name) {
      throw new KinveyError('A name is required to open a database.');
    }

    let db = dbCache[name];

    if (!db) {
      db = new DB(name);
    }

    return db;
  }
}
