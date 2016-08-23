import { Rack } from './rack';
import { SerializeMiddleware, HttpMiddleware, ParseMiddleware } from './middleware';

export class NetworkRack extends Rack {
  constructor(name = 'Network Rack') {
    super(name);
    this.use(new SerializeMiddleware());
    this.use(new HttpMiddleware());
    this.use(new ParseMiddleware());
  }
}
