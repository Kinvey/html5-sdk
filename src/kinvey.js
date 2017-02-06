import Kinvey, { ParseMiddleware, SerializeMiddleware } from 'kinvey-node-sdk/dist/export';
import {
  CacheMiddleware,
  HttpMiddleware
} from './middleware';

// Setup racks
Kinvey.CacheRack.reset();
Kinvey.CacheRack.use(new CacheMiddleware());
Kinvey.NetworkRack.reset();
Kinvey.NetworkRack.use(new SerializeMiddleware());
Kinvey.NetworkRack.use(new HttpMiddleware());
Kinvey.NetworkRack.use(new ParseMiddleware());

// Export
export default Kinvey;
