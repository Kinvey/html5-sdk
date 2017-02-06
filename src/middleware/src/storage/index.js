import { Storage, isDefined } from 'kinvey-node-sdk/dist/export';
import IndexedDBAdapter from './src/indexeddb';
import WebSQLAdapter from './src/websql';
import { LocalStorageAdapter } from './src/webstorage';

export default class HTML5Storage extends Storage {
  loadAdapter() {
    return Promise.resolve()
      .then(() => WebSQLAdapter.load(this.name))
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return IndexedDBAdapter.load(this.name);
        }

        return adapter;
      })
      .then((adapter) => {
        if (isDefined(adapter) === false) {
          return LocalStorageAdapter.load(this.name);
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
