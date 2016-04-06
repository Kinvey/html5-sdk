'use strict';

var _kinveyJavascriptSdkCore = require('kinvey-javascript-sdk-core');

var _rack = require('kinvey-javascript-sdk-core/build/rack/rack');

var _serialize = require('kinvey-javascript-sdk-core/build/rack/middleware/serialize');

var _http = require('./http');

var _device = require('kinvey-javascript-sdk-core/build/utils/device');

var _device2 = require('./device');

var _popup = require('kinvey-javascript-sdk-core/build/utils/popup');

var _popup2 = require('./popup');

// Add Http middleware
var networkRack = _rack.NetworkRack.sharedInstance();
networkRack.useAfter(_serialize.SerializeMiddleware, new _http.HttpMiddleware());

// Use Device Adapter
_device.Device.use(new _device2.DeviceAdapter());

// Use Popup Adapter
_popup.Popup.use(new _popup2.PopupAdapter());

// Export
module.exports = _kinveyJavascriptSdkCore.Kinvey;