import NodeCacheMiddleware from 'kinvey-node-sdk/dist/rack/src/cache';
import Storage from './storage';

export default class CacheMiddleware extends NodeCacheMiddleware {
  openStorage(name) {
    return new Storage(name);
  }
}
