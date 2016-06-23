'use strict';

require('regenerator-runtime');

var _kinvey = require('kinvey-javascript-sdk-core/dist/kinvey');

var _rack = require('kinvey-javascript-sdk-core/dist/rack/rack');

var _cache = require('kinvey-javascript-sdk-core/dist/rack/cache');

var _cache2 = require('./cache');

var _http = require('kinvey-javascript-sdk-core/dist/rack/http');

var _http2 = require('./http');

var _device = require('./device');

var _popup = require('./popup');

// Swap Cache Middelware
var cacheRack = _rack.KinveyRackManager.cacheRack;
cacheRack.swap(_cache.CacheMiddleware, new _cache2.CacheMiddleware());

// Swap Http middleware
var networkRack = _rack.KinveyRackManager.networkRack;
networkRack.swap(_http.HttpMiddleware, new _http2.HttpMiddleware());

// Expose some globals
global.KinveyDevice = _device.Device;
global.KinveyPopup = _popup.Popup;

// Export
module.exports = _kinvey.Kinvey;