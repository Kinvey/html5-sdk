<<<<<<< Updated upstream:src/middleware/src/storage/index.js
import { isDefined } from 'kinvey-js-sdk/dist/export';
import KinveyStorage from 'kinvey-js-sdk/dist/request/src/middleware/src/storage';
import IndexedDB from './src/indexeddb';
import WebSQL from './src/websql';
import { LocalStorage } from './src/webstorage';
=======
import { isDefined, Storage as KinveyStorage } from 'kinvey-js-sdk';
import { IndexedDBAdapter } from './indexeddb';
import { WebSQLAdapter } from './websql';
import { LocalStorageAdapter } from './webstorage';
>>>>>>> Stashed changes:src/middleware/storage/index.js

export default class Storage extends KinveyStorage {
  loadAdapter() {
    return WebSQL.load(this.name)
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return IndexedDB.load(this.name);
        }

        return adapter;
      })
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return LocalStorage.load(this.name);
        }

        return adapter;
      })
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return super.loadAdapter();
        }

        return adapter;
      });
  }
}
