import { CacheMiddleware as CoreCacheMiddleware } from 'kinvey-js-sdk';
import { Storage } from './storage';

export class CacheMiddleware extends CoreCacheMiddleware {
  loadStorage(name) {
    return new Storage(name);
  }
}
