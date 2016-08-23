import { Middleware } from 'kinvey-javascript-rack/dist/middleware';
import { DB } from './db';
import { KinveyError } from 'kinvey-javascript-sdk-core/dist/errors';
import regeneratorRuntime from 'regenerator-runtime'; // eslint-disable-line no-unused-vars
import isEmpty from 'lodash/isEmpty';
const dbCache = {};

export class CacheMiddleware extends Middleware {
  openDatabase(name) {
    if (!name) {
      throw new KinveyError('A name is required to open a database.');
    }

    let db = dbCache[name];

    if (!db) {
      db = new DB(name);
    }

    return db;
  }

  async handle(request) {
    const { method, query, body, appKey, collection, entityId, client } = request;
    const db = this.openDatabase(appKey, client ? client.encryptionKey : undefined);
    let data;

    if (method === 'GET') {
      if (entityId) {
        if (entityId === '_count') {
          data = await db.count(collection, query);
        } else if (entityId === '_group') {
          data = await db.group(collection, body);
        } else {
          data = await db.findById(collection, entityId);
        }
      } else {
        data = await db.find(collection, query);
      }
    } else if (method === 'POST' || method === 'PUT') {
      data = await db.save(collection, body);
    } else if (method === 'DELETE') {
      if (collection && entityId) {
        data = await db.removeById(collection, entityId);
      } else if (!collection) {
        data = await db.clear();
      } else {
        data = await db.remove(collection, query);
      }
    }

    const response = {
      statusCode: method === 'POST' ? 201 : 200,
      headers: {},
      data: data
    };

    if (!data || isEmpty(data)) {
      response.statusCode = 204;
    }

    return { response: response };
  }
}
