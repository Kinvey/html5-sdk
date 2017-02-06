'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpMiddleware = exports.CacheMiddleware = undefined;

var _cache = require('./src/cache');

var _cache2 = _interopRequireDefault(_cache);

var _http = require('./src/http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CacheMiddleware = _cache2.default;
exports.HttpMiddleware = _http2.default;