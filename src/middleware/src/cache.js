import Middleware from 'kinvey-node-sdk/dist/request/src/rack/src/middleware';
import Storage from './storage';
import isEmpty from 'lodash/isEmpty';

export default class CacheMiddleware extends Middleware {
  constructor(name = 'Cache Middleware') {
    super(name);
  }

  handle(request) {
    const { method, body, appKey, collection, entityId } = request;
    const storage = new Storage(appKey);
    let promise;

    if (method === 'GET') {
      if (entityId) {
        promise = storage.findById(collection, entityId);
      } else {
        promise = storage.find(collection);
      }
    } else if (method === 'POST' || method === 'PUT') {
      promise = storage.save(collection, body);
    } else if (method === 'DELETE') {
      if (collection && entityId) {
        promise = storage.removeById(collection, entityId);
      } else if (!collection) {
        promise = storage.clear();
      } else {
        promise = storage.remove(collection, body);
      }
    }

    return promise.then((data) => {
      const response = {
        statusCode: method === 'POST' ? 201 : 200,
        data: data
      };

      if (!data || isEmpty(data)) {
        response.statusCode = 204;
      }

      return response;
    })
    .catch(error => ({ statusCode: error.code || 500 }))
    .then(response => ({ response: response }));
  }
}
