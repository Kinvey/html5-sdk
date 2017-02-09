'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _export = require('kinvey-node-sdk/dist/export');

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTML5CacheMiddleware = function (_CacheMiddleware) {
  _inherits(HTML5CacheMiddleware, _CacheMiddleware);

  function HTML5CacheMiddleware() {
    _classCallCheck(this, HTML5CacheMiddleware);

    return _possibleConstructorReturn(this, (HTML5CacheMiddleware.__proto__ || Object.getPrototypeOf(HTML5CacheMiddleware)).apply(this, arguments));
  }

  _createClass(HTML5CacheMiddleware, [{
    key: 'loadStorage',
    value: function loadStorage(name) {
      return new _storage2.default(name);
    }
  }]);

  return HTML5CacheMiddleware;
}(_export.CacheMiddleware);

exports.default = HTML5CacheMiddleware;