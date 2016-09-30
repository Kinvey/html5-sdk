'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _storage = require('kinvey-node-sdk/dist/rack/src/storage');

var _storage2 = _interopRequireDefault(_storage);

var _indexeddb = require('./src/indexeddb');

var _indexeddb2 = _interopRequireDefault(_indexeddb);

var _websql = require('./src/websql');

var _websql2 = _interopRequireDefault(_websql);

var _webstorage = require('./src/webstorage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Storage = function (_NodeStorage) {
  _inherits(Storage, _NodeStorage);

  function Storage() {
    _classCallCheck(this, Storage);

    return _possibleConstructorReturn(this, (Storage.__proto__ || Object.getPrototypeOf(Storage)).apply(this, arguments));
  }

  _createClass(Storage, [{
    key: 'adapter',
    get: function get() {
      if (_websql2.default.isSupported()) {
        return new _websql2.default(this.name);
      } else if (_indexeddb2.default.isSupported()) {
        return new _indexeddb2.default(this.name);
      } else if (_webstorage.LocalStorage.isSupported()) {
        return new _webstorage.LocalStorage(this.name);
      } else if (_webstorage.SessionStorage.isSupported()) {
        return new _webstorage.SessionStorage(this.name);
      }

      return _get(Storage.prototype.__proto__ || Object.getPrototypeOf(Storage.prototype), 'adapter', this);
    }
  }]);

  return Storage;
}(_storage2.default);

exports.default = Storage;