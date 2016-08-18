'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheMiddleware = exports.DB = exports.DBAdapter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rack = require('kinvey-javascript-sdk-core/dist/rack');

var _errors = require('kinvey-javascript-sdk-core/dist/errors');

var _utils = require('kinvey-javascript-sdk-core/dist/utils');

var _storage = require('./storage');

var _indexeddb = require('./indexeddb');

var _websql = require('./websql');

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var dbCache = {};

/**
 * Enum for DB Adapters.
 */
var DBAdapter = {
  IndexedDB: 'IndexedDB',
  LocalStorage: 'LocalStorage',
  SessionStorage: 'SessionStorage',
  WebSQL: 'WebSQL'
};
Object.freeze(DBAdapter);
exports.DBAdapter = DBAdapter;

var DB = exports.DB = function (_CoreDB) {
  _inherits(DB, _CoreDB);

  function DB() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'kinvey' : arguments[0];
    var adapters = arguments.length <= 1 || arguments[1] === undefined ? [DBAdapter.IndexedDB, DBAdapter.WebSQL, DBAdapter.LocalStorage, DBAdapter.SessionStorage] : arguments[1];

    _classCallCheck(this, DB);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DB).call(this, name));

    if (!(0, _isArray2.default)(adapters)) {
      adapters = [adapters];
    }

    (0, _forEach2.default)(adapters, function (adapter) {
      switch (adapter) {
        case DBAdapter.IndexedDB:
          if (_indexeddb.IndexedDB.isSupported()) {
            _this.adapter = new _indexeddb.IndexedDB(name);
            return false;
          }

          break;
        case DBAdapter.LocalStorage:
          if (_storage.LocalStorage.isSupported()) {
            _this.adapter = new _storage.LocalStorage(name);
            return false;
          }

          break;
        case DBAdapter.SessionStorage:
          if (_storage.SessionStorage.isSupported()) {
            _this.adapter = new _storage.SessionStorage(name);
            return false;
          }

          break;
        case DBAdapter.WebSQL:
          if (_websql.WebSQL.isSupported()) {
            _this.adapter = new _websql.WebSQL(name);
            return false;
          }

          break;
        default:
          _utils.Log.warn('The ' + adapter + ' adapter is is not recognized.');
      }

      return true;
    });
    return _this;
  }

  return DB;
}(_rack.DB);

var CacheMiddleware = exports.CacheMiddleware = function (_CoreCacheMiddelware) {
  _inherits(CacheMiddleware, _CoreCacheMiddelware);

  function CacheMiddleware() {
    _classCallCheck(this, CacheMiddleware);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CacheMiddleware).apply(this, arguments));
  }

  _createClass(CacheMiddleware, [{
    key: 'openDatabase',
    value: function openDatabase(name) {
      if (!name) {
        throw new _errors.KinveyError('A name is required to open a database.');
      }

      var db = dbCache[name];

      if (!db) {
        db = new DB(name);
      }

      return db;
    }
  }]);

  return CacheMiddleware;
}(_rack.CacheMiddleware);