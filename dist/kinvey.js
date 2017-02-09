'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _export = require('kinvey-node-sdk/dist/export');

var _export2 = _interopRequireDefault(_export);

var _middleware = require('./middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setup racks
_export2.default.CacheRack.reset();
_export2.default.CacheRack.use(new _middleware.CacheMiddleware());
_export2.default.NetworkRack.reset();
_export2.default.NetworkRack.use(new _export.SerializeMiddleware());
_export2.default.NetworkRack.use(new _middleware.HttpMiddleware());
_export2.default.NetworkRack.use(new _export.ParseMiddleware());

// Export
exports.default = _export2.default;