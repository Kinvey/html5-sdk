import { NotFoundError } from './errors';
import Promise from 'es6-promise';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
const idAttribute = process.env.KINVEY_ID_ATTRIBUTE || '_id';
const masterCollectionName = 'sqlite_master';
let dbCache = {};
let isSupported;
const SIZE = 5 * 1000 * 1000; // 5mb

export default class WebSQL {
  constructor(name = 'kinvey') {
    this.name = name;
  }

  openDatabase() {
    let db = dbCache[this.name];

    if (!db) {
      db = global.openDatabase(this.name, 1, '', SIZE);
      dbCache[this.name] = db;
    }

    return db;
  }

  openTransaction(collection, query, parameters, write = false) {
    const db = this.openDatabase();
    const escapedCollection = `"${collection}"`;
    const isMaster = collection === masterCollectionName;
    const isMulti = isArray(query);
    query = isMulti ? query : [[query, parameters]];

    const promise = new Promise((resolve, reject) => {
      const writeTxn = write || !isFunction(db.readTransaction);
      db[writeTxn ? 'transaction' : 'readTransaction']((tx) => {
        if (write && !isMaster) {
          tx.executeSql(`CREATE TABLE IF NOT EXISTS ${escapedCollection} ` +
            '(key BLOB PRIMARY KEY NOT NULL, value BLOB NOT NULL)');
        }

        let pending = query.length;
        const responses = [];

        if (pending === 0) {
          resolve(isMulti ? responses : responses.shift());
        } else {
          forEach(query, (parts) => {
            const sql = parts[0].replace('#{collection}', escapedCollection);

            tx.executeSql(sql, parts[1], (_, resultSet) => {
              const response = {
                rowCount: resultSet.rowsAffected,
                result: []
              };

              if (resultSet.rows.length) {
                for (let i = 0, len = resultSet.rows.length; i < len; i += 1) {
                  try {
                    const value = resultSet.rows.item(i).value;
                    const entity = isMaster ? value : JSON.parse(value);
                    response.result.push(entity);
                  } catch (error) {
                    // Catch the error
                  }
                }
              }

              responses.push(response);
              pending -= 1;

              if (pending === 0) {
                resolve(isMulti ? responses : responses.shift());
              }
            });
          });
        }
      }, (error) => {
        error = isString(error) ? error : error.message;

        // Safari calls this function regardless if user permits more quota or not.
        // And there's no way for a developer to know user's reaction.
        if (error && typeof SQLError !== 'undefined' && error.code === SQLError.QUOTA_ERR) {
          // Start over the transaction again to check if user permitted or not.
          return this.openTransaction(collection, query, parameters, write);
        }

        if (error && error.indexOf('no such table') === -1) {
          return reject(new NotFoundError(`The ${collection} collection was not found on`
            + ` the ${this.name} WebSQL database.`));
        }

        const checkQuery = 'SELECT name AS value from #{collection} WHERE type = ? AND name = ?';
        const checkParameters = ['table', collection];

        return this.openTransaction(masterCollectionName, checkQuery, checkParameters).then((response) => {
          if (response.result.length === 0) {
            return reject(new NotFoundError(`The ${collection} collection was not found on`
              + ` the ${this.name} WebSQL database.`));
          }

          return reject(new Error(`Unable to open a transaction for the ${collection}`
            + ` collection on the ${this.name} WebSQL database.`));
        }).catch((error) => {
          reject(new Error(`Unable to open a transaction for the ${collection}`
            + ` collection on the ${this.name} WebSQL database.`, error));
        });
      });
    });

    return promise;
  }

  find(collection) {
    const sql = 'SELECT value FROM #{collection}';
    return this.openTransaction(collection, sql, [])
      .then(response => response.result);
  }

  findById(collection, id) {
    const sql = 'SELECT value FROM #{collection} WHERE key = ?';
    return this.openTransaction(collection, sql, [id])
      .then(response => response.result)
      .then((entities) => {
        if (entities.length === 0) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
            + ` collection on the ${this.name} WebSQL database.`);
        }

        return entities[0];
      });
  }

  save(collection, entities) {
    const queries = [];
    let singular = false;

    if (!isArray(entities)) {
      singular = true;
      entities = [entities];
    }

    if (entities.length === 0) {
      return Promise.resolve(null);
    }

    entities = map(entities, (entity) => {
      queries.push([
        'REPLACE INTO #{collection} (key, value) VALUES (?, ?)',
        [entity[idAttribute], JSON.stringify(entity)]
      ]);

      return entity;
    });

    return this.openTransaction(collection, queries, null, true)
      .then(() => (singular ? entities[0] : entities));
  }

  removeById(collection, id) {
    const queries = [
      ['SELECT value FROM #{collection} WHERE key = ?', [id]],
      ['DELETE FROM #{collection} WHERE key = ?', [id]],
    ];
    return this.openTransaction(collection, queries, null, true)
      .then((response) => {
        const entities = response[0].result;
        let count = response[1].rowCount;
        count = count || entities.length;

        if (count === 0) {
          throw new NotFoundError(`An entity with _id = ${id} was not found in the ${collection}`
            + ` collection on the ${this.name} WebSQL database.`);
        }

        return entities[0];
      });
  }

  clear() {
    return this.openTransaction(
      masterCollectionName,
      'SELECT name AS value FROM #{collection} WHERE type = ?',
      ['table'],
      false
    )
      .then(response => response.result)
      .then((tables) => {
        // If there are no tables, return.
        if (tables.length === 0) {
          return null;
        }

        // Drop all tables. Filter tables first to avoid attempting to delete
        // system tables (which will fail).
        const queries = tables
          .filter(table => (/^[a-zA-Z0-9-]{1,128}/).test(table))
          .map(table => [`DROP TABLE IF EXISTS '${table}'`]);
        return this.openTransaction(masterCollectionName, queries, null, true);
      })
      .then(() => {
        dbCache = {};
        return null;
      });
  }

  static loadAdapter(name) {
    const db = new WebSQL(name);

    if (typeof isSupported !== 'undefined') {
      if (isSupported) {
        return Promise.resolve(db);
      }

      return Promise.resolve(undefined);
    }

    if (typeof global.openDatabase === 'undefined') {
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
