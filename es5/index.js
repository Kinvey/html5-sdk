'use strict';

var _kinveyJavascriptSdkCore = require('kinvey-javascript-sdk-core');

var _kinveyJavascriptSdkCore2 = _interopRequireDefault(_kinveyJavascriptSdkCore);

var _rack = require('kinvey-javascript-sdk-core/es5/rack/rack');

var _http = require('kinvey-javascript-sdk-core/es5/rack/middleware/http');

var _http2 = require('./http');

var _device = require('./device');

var _popup = require('./popup');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add Http middleware
var networkRack = _rack.NetworkRack.sharedInstance();
networkRack.swap(_http.HttpMiddleware, new _http2.Html5HttpMiddleware());

// Expose some globals
global.KinveyDevice = _device.Html5Device;
global.KinveyPopup = _popup.Html5Popup;

// Export
module.exports = _kinveyJavascriptSdkCore2.default;