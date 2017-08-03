import { isDefined, Storage as KinveyStorage } from 'kinvey-js-sdk';
import { IndexedDBAdapter } from './indexeddb';
import { WebSQLAdapter } from './websql';
import { LocalStorageAdapter } from './webstorage';

export default class Storage extends KinveyStorage {
  loadAdapter() {
    return WebSQLAdapter.load(this.name)
      .then((adapter) => {
        if (!isDefined(adapter)) {
          return IndexedDBAdapter.load(this.name);
        }

        return adapter;
      })
      .then((adapter) => {
        if (!isDefined(adapter)) {
          return LocalStorageAdapter.load(this.name);
        }

        return adapter;
      })
      .then((adapter) => {
        if (!isDefined(adapter)) {
          return super.loadAdapter();
        }

        return adapter;
      });
  }
}
