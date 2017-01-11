import { CacheMiddleware } from 'kinvey-node-sdk/lib/export';
import Storage from './storage';

export default class HTML5CacheMiddleware extends CacheMiddleware {
  loadStorage(name) {
    return new Storage(name);
  }
}
