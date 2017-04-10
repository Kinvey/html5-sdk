import Kinvey, { CacheRack, NetworkRack, User } from 'kinvey-js-sdk/dist/export';
import { CacheMiddleware, HttpMiddleware } from './middleware';
import Popup from './popup';

// Setup racks
CacheRack.useCacheMiddleware(new CacheMiddleware());
NetworkRack.useHttpMiddleware(new HttpMiddleware());

// Setup popup
User.usePopupClass(Popup);

// Export
module.exports = Kinvey;
