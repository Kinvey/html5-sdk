import { NotFoundError } from './errors';
import Promise from 'es6-promise';
import forEach from 'lodash/forEach';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
let dbCache = {};
let isSupported;

const TransactionMode = {
  ReadWrite: 'readwrite',
  ReadOnly: 'readonly',
};
Object.freeze(TransactionMode);

export default class IndexedDB {
  constructor(name) {
    if (!name) {
      throw new Error('A name is required to use the IndexedDB adapter.', name);
    }

    if (!isString(name)) {
      throw new Error('The name must be a string to use the IndexedDB adapter', name);
    }

    this.name = name;
    this.inTransaction = false;
    this.queue = [];
  }

  openTransaction(collection, write = false, success, error, force = false) {
    const indexedDB = global.indexedDB
      || global.webkitIndexedDB
      || global.mozIndexedDB
      || global.msIndexedDB
      || global.shimIndexedDB;
    let db = dbCache[this.name];

    if (db) {
      const containsCollection = isFunction(db.objectStoreNames.contains) ?
        db.objectStoreNames.contains(collection) : db.objectStoreNames.indexOf(collection) !== -1;

      if (containsCollection) {
        try {
          const mode = write ? TransactionMode.ReadWrite : TransactionMode.ReadOnly;
          const txn = db.transaction(collection, mode);

          if (txn) {
            return success(txn);
          }

          throw new Error(`Unable to open a transaction for ${collection}`
            + ` collection on the ${this.name} IndexedDB database.`);
        } catch (err) {
          return error(err);
        }
      } else if (!write) {
        return error(new NotFoundError(`The ${collection} collection was not found on`
          + ` the ${this.name} IndexedDB database.`));
      }
    }

    if (!force && this.inTransaction) {
      return this.queue.push(() => {
        this.openTransaction(collection, write, success, error);
      });
    }

    // Switch flag
    this.inTransaction = true;
    let request;

    try {
      if (db) {
        const version = db.version + 1;
        db.close();
        request = indexedDB.open(this.name, version);
      } else {
        request = indexedDB.open(this.name);
      }
    } catch (err) {
      error(err);
    }

    // If the database is opened with an higher version than its current, the
    // `upgradeneeded` event is fired. Save the handle to the database, and
    // create the collection.
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      dbCache[this.name] = db;

      if (write) {
        db.createObjectStore(collection, { keyPath: '_id' });
      }
    };

    // The `success` event is fired after `upgradeneeded` terminates.
    // Save the handle to the database.
    request.onsuccess = (e) => {
      db = e.target.result;
      dbCache[this.name] = db;

      // If a second instance of the same IndexedDB database performs an
      // upgrade operation, the `versionchange` event is fired. Then, close the
      // database to allow the external upgrade to proceed.
      db.onversionchange = () => {
        if (db) {
          db.close();
          db = null;
          dbCache[this.name] = null;
        }
      };

      // Try to obtain the collection handle by recursing. Append the handlers
      // to empty the queue upon success and failure. Set the `force` flag so
      // all but the current transaction remain queued.
      const wrap = (done) => {
        const callbackFn = (arg) => {
          done(arg);

          // Switch flag
          this.inTransaction = false;

          // The database handle has been established, we can now safely empty
          // the queue. The queue must be emptied before invoking the concurrent
          // operations to avoid infinite recursion.
          if (this.queue.length > 0) {
            const pending = this.queue;
            this.queue = [];
            forEach(pending, (fn) => {
              fn.call(this);
            });
          }
        };
        return callbackFn;
      };

      return this.openTransaction(collection, write, wrap(success), wrap(error), true);
    };

    // The `blocked` event is not handled. In case such an event occurs, it
    // will resolve itself since the `versionchange` event handler will close
    // the conflicting database and enable the `blocked` event to continue.
    request.onblocked = () => {};

    // Handle errors
    request.onerror = (e) => {
      error(new Error(`Unable to open the ${this.name} IndexedDB database.`
        + ` ${e.target.error.message}.`));
    };

    return request;
  }

  find(collection) {
    return new Promise((resolve, reject) => {
      this.openTransaction(collection, false, (txn) => {
        const store = txn.objectStore(collection);
        const request = store.openCursor();
        const entities = [];

        request.onsuccess = (e) => {
          const cursor = e.target.result;

          if (cursor) {
            entities.push(cursor.value);
            return cursor.continue();
          }

          return resolve(entities);
        };

        request.onerror = (e) => {
          reject(e);
        };
      }, reject);
    });
  }

  findById(collection, id) {
    return new Promise((resolve, reject) => {
      this.openTransaction(collection, false, (txn) => {
        const store = txn.objectStore(collection);
        const request = store.get(id);

        request.onsuccess = (e) => {
          const entity = e.target.result;

          if (entity) {
            resolve(entity);
          } else {
            reject(new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
             + ` collection on the ${this.name} IndexedDB database.`));
          }
        };

        request.onerror = () => {
          reject(new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
             + ` collection on the ${this.name} IndexedDB database.`));
        };
      }, reject);
    });
  }

  save(collection, entities) {
    let singular = false;

    if (!isArray(entities)) {
      singular = true;
      entities = [entities];
    }

    if (entities.length === 0) {
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      this.openTransaction(collection, true, (txn) => {
        const store = txn.objectStore(collection);

        forEach(entities, (entity) => {
          store.put(entity);
        });

        txn.oncomplete = () => {
          resolve(singular ? entities[0] : entities);
        };

        txn.onerror = (e) => {
          reject(new Error(`An error occurred while saving the entities to the ${collection}`
            + ` collection on the ${this.name} IndexedDB database. ${e.target.error.message}.`));
        };
      }, reject);
    });
  }

  removeById(collection, id) {
    return new Promise((resolve, reject) => {
      this.openTransaction(collection, true, (txn) => {
        const store = txn.objectStore(collection);
        const request = store.get(id);
        store.delete(id);

        txn.oncomplete = () => {
          const entity = request.result;

          if (entity) {
            resolve(entity);
          } else {
            reject(new NotFoundError(`An entity with id = ${id} was not found in the ${collection}`
              + ` collection on the ${this.name} IndexedDB database.`));
          }
        };

        txn.onerror = () => {
          reject(new NotFoundError(`An entity with id = ${id} was not found in the ${collection}`
              + ` collection on the ${this.name} IndexedDB database.`));
        };
      }, reject);
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      const indexedDB = global.indexedDB
      || global.webkitIndexedDB
      || global.mozIndexedDB
      || global.msIndexedDB
      || global.shimIndexedDB;
      const request = indexedDB.deleteDatabase(this.name);

      request.onsuccess = () => {
        dbCache = {};
        resolve();
      };

      request.onerror = (e) => {
        reject(new Error(`An error occurred while clearing the ${this.name} IndexedDB database.`
            + ` ${e.target.error.message}.`));
      };
    });
  }

  static loadAdapter(name) {
    const indexedDB = global.indexedDB
      || global.webkitIndexedDB
      || global.mozIndexedDB
      || global.msIndexedDB
      || global.shimIndexedDB;
    const db = new IndexedDB(name);

    if (typeof isSupported !== 'undefined') {
      if (isSupported) {
        return Promise.resolve(db);
      }

      return Promise.resolve(undefined);
    }

    if (typeof indexedDB === 'undefined') {
      isSupported = false;
      return Promise.resolve(undefined);
    }

    return db.save('__testSupport', { _id: '1' })
      .then(() => {
        isSupported = true;
        return db;
      })
      .catch(() => {
        isSupported = false;
        return undefined;
      });
  }
}
