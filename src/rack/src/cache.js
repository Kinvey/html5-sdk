import NodeCacheMiddleware from 'kinvey-node-sdk/dist/rack/src/cache';
import Storage from './storage';

export default class CacheMiddleware extends NodeCacheMiddleware {
  constructor(name = 'Cache Middleware') {
    super(name);
  }

  openStorage(name) {
    return new Storage(name);
  }
}
