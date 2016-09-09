'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Kinvey = undefined;

var _rack = require('./rack');

var _kinveyJavascriptSdkCore = require('kinvey-javascript-sdk-core');

var _device = require('./device');

var _popup = require('./popup');

var _es6Promise = require('es6-promise');

// Set CacheRequest rack
_kinveyJavascriptSdkCore.CacheRequest.rack = new _rack.CacheRack();

// Set NetworkRequest rack
_kinveyJavascriptSdkCore.NetworkRequest.rack = new _rack.NetworkRack();

// Add modules
_kinveyJavascriptSdkCore.Kinvey.Device = _device.Device;
_kinveyJavascriptSdkCore.Kinvey.Popup = _popup.Popup;
_kinveyJavascriptSdkCore.Kinvey.Promise = _es6Promise.Promise;
_kinveyJavascriptSdkCore.Kinvey.CacheMiddleware = _rack.CacheMiddleware;
_kinveyJavascriptSdkCore.Kinvey.HttpMiddleware = _rack.XHRMiddleware;
_kinveyJavascriptSdkCore.Kinvey.ParseMiddleware = _rack.ParseMiddleware;
_kinveyJavascriptSdkCore.Kinvey.SerializeMiddleware = _rack.SerializeMiddleware;

// Export
exports.Kinvey = _kinveyJavascriptSdkCore.Kinvey;