import KinveyStorage from 'kinvey-node-sdk/dist/request/src/middleware/src/storage';
import { isDefined } from 'kinvey-node-sdk/dist/utils';
import IndexedDB from './src/indexeddb';
import WebSQL from './src/websql';
import { LocalStorage } from './src/webstorage';

export default class Storage extends KinveyStorage {
  getAdapter() {
    return IndexedDB.loadAdapter(this.name)
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return WebSQL.loadAdapter(this.name);
        }

        return adapter;
      })
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return LocalStorage.loadAdapter(this.name);
        }

        return adapter;
      })
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return super.getAdapter();
        }

        return adapter;
      });
  }
}
