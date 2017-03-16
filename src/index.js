import Kinvey, { CacheRack, NetworkRack } from 'kinvey-js-sdk/dist/export';
import { CacheMiddleware, HttpMiddleware } from './middleware';

// Setup racks
CacheRack.useCacheMiddleware(new CacheMiddleware());
NetworkRack.useHttpMiddleware(new HttpMiddleware());

// Export
module.exports = Kinvey;
