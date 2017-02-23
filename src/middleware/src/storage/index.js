import KinveyStorage from 'kinvey-js-sdk/dist/request/src/middleware/src/storage';
import { isDefined } from 'kinvey-js-sdk/dist/utils';
import IndexedDB from './src/indexeddb';
import WebSQL from './src/websql';
import { LocalStorage } from './src/webstorage';

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
