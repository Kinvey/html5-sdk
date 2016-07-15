import { Kinvey } from 'kinvey-javascript-sdk-core/dist/kinvey';
import { KinveyRackManager } from 'kinvey-javascript-sdk-core/dist/rack/rack';
import { CacheMiddleware as CoreCacheMiddleware } from 'kinvey-javascript-sdk-core/dist/rack/cache';
import { CacheMiddleware } from './cache';
import { HttpMiddleware as CoreHttpMiddleware } from 'kinvey-javascript-sdk-core/dist/rack/http';
import { HttpMiddleware } from './http';
import { Device } from './device';
import { Popup } from './popup';

// Swap Cache Middelware
const cacheRack = KinveyRackManager.cacheRack;
cacheRack.swap(CoreCacheMiddleware, new CacheMiddleware());

// Swap Http middleware
const networkRack = KinveyRackManager.networkRack;
networkRack.swap(CoreHttpMiddleware, new HttpMiddleware());

// Expose some globals
global.KinveyDevice = Device;
global.KinveyPopup = Popup;

// Export
module.exports = Kinvey;
