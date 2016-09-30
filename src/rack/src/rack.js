import Rack from 'kinvey-node-sdk/dist/rack';
import CacheMiddleware from './cache';

export default class CacheRack extends Rack {
  constructor(name = 'Cache Rack') {
    super(name);
    this.use(new CacheMiddleware());
  }
}
