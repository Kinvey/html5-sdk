import NodeStorage from 'kinvey-node-sdk/dist/rack/src/storage';
import IndexedDB from './src/indexeddb';
import WebSQL from './src/websql';
import { LocalStorage, SessionStorage } from './src/webstorage';

export default class Storage extends NodeStorage {
  get adapter() {
    if (WebSQL.isSupported()) {
      return new WebSQL(this.name);
    } else if (IndexedDB.isSupported()) {
      return new IndexedDB(this.name);
    } else if (LocalStorage.isSupported()) {
      return new LocalStorage(this.name);
    } else if (SessionStorage.isSupported()) {
      return new SessionStorage(this.name);
    }

    return super.adapter;
  }
}
