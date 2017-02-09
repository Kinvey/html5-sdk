import { CacheMiddleware } from 'kinvey-node-sdk/dist/export';
import Storage from './storage';

export default class HTML5CacheMiddleware extends CacheMiddleware {
  loadStorage(name) {
    return new Storage(name);
  }
}
