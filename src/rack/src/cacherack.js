import { Rack } from './rack';
import { CacheMiddleware } from './middleware';

export class CacheRack extends Rack {
  constructor(name = 'Cache Rack') {
    super(name);
    this.use(new CacheMiddleware());
  }
}
