import { isDefined } from 'kinvey-js-sdk/dist/export';
import { Storage as CoreStorage } from 'kinvey-js-sdk/dist/request/src/middleware/src/storage';
import IndexedDB from './src/indexeddb';
import WebSQL from './src/websql';
import { LocalStorage } from './src/webstorage';

export default class Storage extends CoreStorage {
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
