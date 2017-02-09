'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Popup = undefined;

var _export = require('kinvey-node-sdk/dist/export');

Object.keys(_export).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _export[key];
    }
  });
});

var _middleware = require('./middleware');

Object.keys(_middleware).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _middleware[key];
    }
  });
});

var _kinvey = require('./kinvey');

var _kinvey2 = _interopRequireDefault(_kinvey);

var _popup = require('./popup');

var _popup2 = _interopRequireDefault(_popup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Popup = _popup2.default;

// Export default

exports.default = _kinvey2.default;