'use strict';

var _kinvey = require('./kinvey');

var _rack = require('kinvey-javascript-sdk-core/dist/rack');

var _cache = require('./cache');

var _http = require('./http');

var _device = require('./device');

var _popup = require('./popup');

// Swap Cache Middelware
var cacheRack = _rack.KinveyRackManager.cacheRack;
cacheRack.swap(_rack.CacheMiddleware, new _cache.CacheMiddleware());

// Swap Http middleware
var networkRack = _rack.KinveyRackManager.networkRack;
networkRack.swap(_rack.HttpMiddleware, new _http.HttpMiddleware());

// Expose some globals
global.KinveyDevice = _device.Device;
global.KinveyPopup = _popup.Popup;

// Export
module.exports = _kinvey.Kinvey;