'use strict';

var _kinvey = require('./kinvey');

var _device = require('./device');

var _popup = require('./popup');

// Expose some globals
global.KinveyDevice = _device.Device;
global.KinveyPopup = _popup.Popup;

// Export
module.exports = _kinvey.Kinvey;