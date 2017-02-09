import { NotFoundError } from 'kinvey-node-sdk/dist/export';
import keyBy from 'lodash/keyBy';
import merge from 'lodash/merge';
import values from 'lodash/values';
import forEach from 'lodash/forEach';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
const idAttribute = process.env.KINVEY_ID_ATTRIBUTE || '_id';
const masterCollectionName = 'master';

export default class WebStorage {
  constructor(name = 'kinvey') {
    this.name = name;
  }

  get masterCollectionName() {
    return `${this.name}_${masterCollectionName}`;
  }
}

export class LocalStorage extends WebStorage {
  constructor(name) {
    super(name);
    global.localStorage.setItem(this.masterCollectionName, JSON.stringify([]));
  }

  _find(collection) {
    try {
      const entities = global.localStorage.getItem(collection);

      if (entities) {
        return Promise.resolve(JSON.parse(entities));
      }

      return Promise.resolve(entities || []);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  find(collection) {
    return this._find(`${this.name}${collection}`);
  }

  findById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entity = find(entities, entity => entity[idAttribute] === id);

        if (!entity) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
            + ` collection on the ${this.name} localstorage database.`);
        }

        return entity;
      });
  }

  save(collection, entities) {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        if (findIndex(collections, collection) === -1) {
          collections.push(collection);
          global.localStorage.setItem(this.masterCollectionName, JSON.stringify(collections));
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

          if (entity) {
            entitiesById[id] = merge(existingEntity, entity);
          }
        });

        global.localStorage.setItem(`${this.name}${collection}`, JSON.stringify(values(entitiesById)));
        return entities;
      });
  }

  removeById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entitiesById = keyBy(entities, idAttribute);
        const entity = entitiesById[id];

        if (!entity) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection} ` +
            `collection on the ${this.name} memory database.`);
        }

        delete entitiesById[id];
        return this.save(collection, values(entitiesById))
          .then(() => entity);
      });
  }

  clear() {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        forEach(collections, (collection) => {
          global.localStorage.removeItem(`${this.name}${collection}`);
        });

        global.localStorage.setItem(this.masterCollectionName, JSON.stringify([]));
        return null;
      });
  }

  static load(name) {
    if (global.localStorage) {
      const item = '__testSupport';
      try {
        global.localStorage.setItem(item, item);
        global.localStorage.getItem(item);
        global.localStorage.removeItem(item);
        return Promise.resolve(new LocalStorage(name));
      } catch (e) {
        return Promise.resolve(undefined);
      }
    }

    return Promise.resolve(undefined);
  }
}

export class SessionStorage extends WebStorage {
  constructor(name) {
    super(name);
    global.sessionStorage.setItem(this.masterCollectionName, JSON.stringify([]));
  }

  _find(collection) {
    try {
      const entities = global.localStorage.getItem(collection);

      if (entities) {
        return Promise.resolve(JSON.parse(entities));
      }

      return Promise.resolve(entities || []);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  find(collection) {
    return this._find(`${this.name}${collection}`);
  }

  findById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entity = find(entities, entity => entity[idAttribute] === id);

        if (!entity) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
            + ` collection on the ${this.name} localstorage database.`);
        }

        return entity;
      });
  }

  save(collection, entities) {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        if (findIndex(collections, collection) === -1) {
          collections.push(collection);
          global.sessionStorage.setItem(this.masterCollectionName, JSON.stringify(collections));
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

          if (entity) {
            entitiesById[id] = merge(existingEntity, entity);
          }
        });

        global.sessionStorage.setItem(`${this.name}${collection}`, JSON.stringify(values(entitiesById)));
        return entities;
      });
  }

  removeById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entitiesById = keyBy(entities, idAttribute);
        const entity = entitiesById[id];

        if (!entity) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection} ` +
            `collection on the ${this.name} memory database.`);
        }

        delete entitiesById[id];
        return this.save(collection, values(entitiesById))
          .then(() => entity);
      });
  }

  clear() {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        forEach(collections, (collection) => {
          global.sessionStorage.removeItem(`${this.name}${collection}`);
        });

        global.sessionStorage.setItem(this.masterCollectionName, JSON.stringify([]));
        return null;
      });
  }

  static load(name) {
    if (global.sessionStorage) {
      const item = '__testSupport';
      try {
        global.sessionStorage.setItem(item, item);
        global.sessionStorage.getItem(item);
        global.sessionStorage.removeItem(item);
        return Promise.resolve(new LocalStorage(name));
      } catch (e) {
        return Promise.resolve(undefined);
      }
    }

    return Promise.resolve(undefined);
  }
}

export class CookieStorage extends WebStorage {
  constructor(name) {
    super(name);
    const expires = new Date();
    expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
    global.document.cookie = `${this.masterCollectionName}=${encodeURIComponent(JSON.stringify([]))}; expires=${expires.toUTCString()}; path=/`;
  }

  _find(collection) {
    const values = document.cookie.split(';');
    for (let i = 0, len = values.length; i < len; i += 1) {
      let value = values[i];
      while (value.charAt(0) === ' ') {
        value = value.substring(1);
      }
      if (value.indexOf(collection) === 0) {
        return Promise.resolve(JSON.parse(decodeURIComponent(value.substring(collection.length, value.length))));
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

        if (!entity) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
            + ` collection on the ${this.name} localstorage database.`);
        }

        return entity;
      });
  }

  save(collection, entities) {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        if (findIndex(collections, collection) === -1) {
          collections.push(collection);
          const expires = new Date();
          expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
          global.document.cookie = `${this.masterCollectionName}=${encodeURIComponent(JSON.stringify(collections))}; expires=${expires.toUTCString()}; path=/`;
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

          if (entity) {
            entitiesById[id] = merge(existingEntity, entity);
          }
        });

        const expires = new Date();
        expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
        global.document.cookie = `${this.name}${collection}=${encodeURIComponent(JSON.stringify(values(entitiesById)))}; expires=${expires.toUTCString()}; path=/`;
        return entities;
      });
  }

  removeById(collection, id) {
    return this.find(collection)
      .then((entities) => {
        const entitiesById = keyBy(entities, idAttribute);
        const entity = entitiesById[id];

        if (!entity) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection} ` +
            `collection on the ${this.name} memory database.`);
        }

        delete entitiesById[id];
        return this.save(collection, values(entitiesById))
          .then(() => entity);
      });
  }

  clear() {
    return this._find(this.masterCollectionName)
      .then((collections) => {
        forEach(collections, (collection) => {
          const expires = new Date();
          expires.setTime(expires.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // Expire in 100 years
          global.document.cookie = `${this.name}${collection}=${encodeURIComponent()}; expires=${expires.toUTCString()}; path=/`;
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

    return Promise.resolve(new CookieStorage(name));
  }
}
