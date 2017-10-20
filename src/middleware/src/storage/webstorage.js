import Promise from 'es6-promise';
import { NotFoundError, isDefined } from 'kinvey-js-sdk/dist/export';
import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';
import values from 'lodash/values';
import forEach from 'lodash/forEach';
import find from 'lodash/find';

const idAttribute = process.env.KINVEY_ID_ATTRIBUTE || '_id';
const masterCollectionName = 'master';

export class WebStorageAdapter {
  constructor(name = 'kinvey') {
    this.name = name;
  }

  get masterCollectionName() {
    return `${this.name}${masterCollectionName}`;
  }

  _serialize(object) {
    return JSON.stringify(object);
  }

  _deserialize(str) {
    return JSON.parse(str);
  }
}


export class KeyValueWebStorageAdapter extends WebStorageAdapter {
  _keyValueStore = null;

  constructor(name, store) {
    super(name);
    this._keyValueStore = store;

    const masterCollection = this._readItem(this.masterCollectionName);
    if (isDefined(masterCollection) === false) {
      this._setItem(this.masterCollectionName, []);
    }
  }

  _getKey(collection) {
    return `${this.name}${collection}`;
  }

  _readItem(key) {
    const str = this.keyValueStore.getItem(key);
    let result = null;
    if (str) {
      result = this._deserialize(str);
    }
    return result;
  }

  _setItem(key, object) {
    const str = this._serialize(object);
    this.keyValueStore.setItem(key, str);
  }

  _removeItem(key) {
    this.keyValueStore.removeItem(key);
  }

  get keyValueStore() {
    return this._keyValueStore;
  }

  _find(collection) {
    try {
      const entities = this._readItem(collection);
      return Promise.resolve(entities || []);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  find(collection) {
    return this._find(this._getKey(collection));
  }

  findById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entity = find(entities, entity => entity[idAttribute] === id);

        if (isDefined(entity) === false) {
          return Promise.reject(new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
            + ` collection on the ${this.name} localstorage database.`));
        }

        return entity;
      });
  }

  save(collection, entities) {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        if (collections.indexOf(collection) === -1) {
          collections.push(collection);
          this._setItem(this.masterCollectionName, collections);
        }

        return this.find(collection);
      })
      .then((existingEntities) => {
        const existingEntitiesById = keyBy(existingEntities, idAttribute);
        const entitiesById = keyBy(entities, idAttribute);
        const existingEntityIds = Object.keys(existingEntitiesById);

        forEach(existingEntityIds, (id) => {
          const existingEntity = existingEntitiesById[id];
          const entity = entitiesById[id];

          if (isDefined(entity)) {
            entitiesById[id] = merge(existingEntity, entity);
          } else {
            entitiesById[id] = existingEntity;
          }
        });

        this._setItem(this._getKey(collection), values(entitiesById));
        return entities;
      });
  }

  removeIds(collection, ids = []) {
    if (!ids.length) {
      return Promise.resolve({ count: 0 });
    }

    return this.find(collection)
      .then((allItems) => {
        const deleteItemsById = keyBy(ids, idAttribute);
        const remainingItems = allItems.filter(i => !deleteItemsById[i._id]);
        this._setItem(this._getKey(collection), remainingItems);
        return {
          count: allItems.length - remainingItems.length
        };
      });
  }

  removeById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entitiesById = keyBy(entities, idAttribute);
        const entity = entitiesById[id];

        if (isDefined(entity) === false) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection} ` +
            `collection on the ${this.name} memory database.`);
        }

        delete entitiesById[id];
        this._setItem(this._getKey(collection), values(entitiesById));
        return { count: 1 };
      });
  }

  clear() {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        forEach(collections, (collection) => {
          this._removeItem(this._getKey(collection));
        });

        this._removeItem(this.masterCollectionName);
        return null;
      });
  }

  testSupport() {
    const str = '__testSupport';
    try {
      this._setItem(str, str);
      this._readItem(str);
      this._removeItem(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  static load(name, keyValueStore) {
    let adapter = new KeyValueWebStorageAdapter(name, keyValueStore);
    const isSupported = adapter.testSupport();
    if (!isSupported) {
      adapter = undefined;
    }
    return Promise.resolve(adapter);
  }
}

export class LocalStorageAdapter extends KeyValueWebStorageAdapter {
  constructor(name) {
    super(name, global.localStorage);
  }

  static load(name) {
    let adapter = new LocalStorageAdapter(name);
    const isSupported = adapter.testSupport();
    if (!isSupported) {
      adapter = undefined;
    }
    return Promise.resolve(adapter);
  }
}

export class SessionStorageAdapter extends KeyValueWebStorageAdapter {
  constructor(name) {
    super(name, global.sessionStorage);
  }

  static load(name) {
    let adapter = new SessionStorageAdapter(name);
    const isSupported = adapter.testSupport();
    if (!isSupported) {
      adapter = undefined;
    }
    return Promise.resolve(adapter);
  }
}

export class CookieStorageAdapter extends WebStorageAdapter {
  constructor(name) {
    super(name);

    const values = global.document.cookie.split(';');
    for (let i = 0, len = values.length; i < len; i += 1) {
      let value = values[i];
      while (value.charAt(0) === ' ') {
        value = value.substring(1);
      }
      if (value.indexOf(this.masterCollectionName) === 0) {
        const masterCollection = decodeURIComponent(value.substring(this.masterCollectionName.length, value.length));

        if (isDefined(masterCollection) === false) {
          const expires = new Date();
          expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
          global.document.cookie = `${this.masterCollectionName}=${encodeURIComponent(JSON.stringify([]))}; expires=${expires.toUTCString()}; path=/`;
        }
      }
    }
  }

  _find(collection) {
    const values = global.document.cookie.split(';');
    for (let i = 0, len = values.length; i < len; i += 1) {
      let value = values[i];
      while (value.charAt(0) === ' ') {
        value = value.substring(1);
      }
      if (value.indexOf(collection) === 0) {
        return Promise.resolve(JSON.parse(decodeURIComponent(value.substring(collection.length + 1, value.length))));
      }
    }
    return Promise.resolve([]);
  }

  find(collection) {
    return this._find(`${this.name}${collection}`);
  }

  findById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entity = find(entities, entity => entity[idAttribute] === id);

        if (isDefined(entity) === false) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
            + ` collection on the ${this.name} localstorage database.`);
        }

        return entity;
      });
  }

  save(collection, entities) {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        if (collections.indexOf(collection) === -1) {
          collections.push(collection);
          const expires = new Date();
          expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
          global.document.cookie = `${this.masterCollectionName}=${encodeURIComponent(JSON.stringify(collections))}; expires=${expires.toUTCString()}; path=/`;
        }

        return this.find(collection);
      })
      .then((existingEntities) => {
        const existingEntitiesById = keyBy(existingEntities, idAttribute);
        const existingEntityIds = Object.keys(existingEntitiesById);
        const entitiesById = keyBy(entities, idAttribute);

        forEach(existingEntityIds, (id) => {
          const existingEntity = existingEntitiesById[id];
          const entity = entitiesById[id];

          if (isDefined(entity)) {
            entitiesById[id] = merge(existingEntity, entity);
          } else {
            entitiesById[id] = existingEntity;
          }
        });

        const expires = new Date();
        expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
        global.document.cookie = `${this.name}${collection}=${encodeURIComponent(JSON.stringify(values(entitiesById)))}; expires=${expires.toUTCString()}; path=/`;
        return entities;
      });
  }

  removeIds(collection, ids) {
    return Promise.all(ids.map((id) => {
      return this.removeById(collection, id);
    }))
      .then(results => ({ count: results.length }));
  }

  removeById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entitiesById = keyBy(entities, idAttribute);
        const entity = entitiesById[id];

        if (isDefined(entity) === false) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection} ` +
            `collection on the ${this.name} memory database.`);
        }

        delete entitiesById[id];
        const expires = new Date();
        expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
        global.document.cookie = `${this.name}${collection}=${encodeURIComponent(JSON.stringify(values(entitiesById)))}; expires=${expires.toUTCString()}; path=/`;
        return { count: 1 };
      });
  }

  clear() {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        forEach(collections, (collection) => {
          const expires = new Date();
          expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
          global.document.cookie = `${this.name}${collection}=${encodeURIComponent(JSON.stringify([]))}; expires=${expires.toUTCString()}; path=/`;
        });

        const expires = new Date();
        expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
        global.document.cookie = `${this.masterCollectionName}=${encodeURIComponent(JSON.stringify([]))}; expires=${expires.toUTCString()}; path=/`;
        return null;
      });
  }

  static load(name) {
    if (typeof global.document.cookie === 'undefined') {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(new CookieStorageAdapter(name));
  }
}
