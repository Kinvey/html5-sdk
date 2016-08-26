'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Kinvey = undefined;

var _kinveyJavascriptSdkCore = require('kinvey-javascript-sdk-core');

var _request = require('kinvey-javascript-sdk-core/dist/request');

var _rack = require('./rack');

var _es6Promise = require('es6-promise');

// Set CacheRequest rack
_request.CacheRequest.rack = new _rack.CacheRack();

// Set NetworkRequest rack
_request.NetworkRequest.rack = new _rack.NetworkRack();

// Add modules
_kinveyJavascriptSdkCore.Kinvey.Promise = _es6Promise.Promise;
_kinveyJavascriptSdkCore.Kinvey.CacheMiddleware = _rack.CacheMiddleware;
_kinveyJavascriptSdkCore.Kinvey.HttpMiddleware = _rack.HttpMiddleware;
_kinveyJavascriptSdkCore.Kinvey.ParseMiddleware = _rack.ParseMiddleware;
_kinveyJavascriptSdkCore.Kinvey.SerializeMiddleware = _rack.SerializeMiddleware;

// Export
exports.Kinvey = _kinveyJavascriptSdkCore.Kinvey;