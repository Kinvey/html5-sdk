import Kinvey from 'kinvey-javascript-sdk-core';
import { CacheRack, NetworkRack } from 'kinvey-javascript-sdk-core/es5/rack/rack';
import { CacheMiddleware as CoreCacheMiddleware } from 'kinvey-javascript-sdk-core/es5/rack/middleware/cache';
import { CacheMiddleware } from './cache';
import { HttpMiddleware as CoreHttpMiddleware } from 'kinvey-javascript-sdk-core/es5/rack/middleware/http';
import { HttpMiddleware } from './http';
import { Device } from './device';
import { Popup } from './popup';

// Swap Cache Middelware
const cacheRack = CacheRack.sharedInstance();
cacheRack.swap(CoreCacheMiddleware, new CacheMiddleware());

// Swap Http middleware
const networkRack = NetworkRack.sharedInstance();
networkRack.swap(CoreHttpMiddleware, new HttpMiddleware());

// Expose some globals
global.KinveyDevice = Device;
global.KinveyPopup = Popup;

// Export
module.exports = Kinvey;
