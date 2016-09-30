'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbCache = {};

var TransactionMode = {
  ReadWrite: 'readwrite',
  ReadOnly: 'readonly'
};
Object.freeze(TransactionMode);

var IndexedDB = function () {
  function IndexedDB(name) {
    _classCallCheck(this, IndexedDB);

    if (!name) {
      throw new Error('A name is required to use the IndexedDB adapter.', name);
    }

    if (!(0, _isString2.default)(name)) {
      throw new Error('The name must be a string to use the IndexedDB adapter', name);
    }

    this.name = name;
    this.inTransaction = false;
    this.queue = [];
  }

  _createClass(IndexedDB, [{
    key: 'openTransaction',
    value: function openTransaction(collection) {
      var write = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var success = arguments[2];

      var _this = this;

      var error = arguments[3];
      var force = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

      var indexedDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB;
      var db = dbCache[this.name];

      if (db) {
        var containsCollection = (0, _isFunction2.default)(db.objectStoreNames.contains) ? db.objectStoreNames.contains(collection) : db.objectStoreNames.indexOf(collection) !== -1;

        if (containsCollection) {
          try {
            var mode = write ? TransactionMode.ReadWrite : TransactionMode.ReadOnly;
            var txn = db.transaction(collection, mode);

            if (txn) {
              return success(txn);
            }

            throw new Error('Unable to open a transaction for ' + collection + (' collection on the ' + this.name + ' IndexedDB database.'));
          } catch (err) {
            return error(err);
          }
        } else if (!write) {
          return error(new _errors.NotFoundError('The ' + collection + ' collection was not found on' + (' the ' + this.name + ' IndexedDB database.')));
        }
      }

      if (!force && this.inTransaction) {
        return this.queue.push(function () {
          _this.openTransaction(collection, write, success, error);
        });
      }

      // Switch flag
      this.inTransaction = true;
      var request = void 0;

      if (db) {
        var version = db.version + 1;
        db.close();
        request = indexedDB.open(this.name, version);
      } else {
        request = indexedDB.open(this.name);
      }

      // If the database is opened with an higher version than its current, the
      // `upgradeneeded` event is fired. Save the handle to the database, and
      // create the collection.
      request.onupgradeneeded = function (e) {
        db = e.target.result;
        dbCache[_this.name] = db;

        if (write) {
          db.createObjectStore(collection, { keyPath: '_id' });
        }
      };

      // The `success` event is fired after `upgradeneeded` terminates.
      // Save the handle to the database.
      request.onsuccess = function (e) {
        db = e.target.result;
        dbCache[_this.name] = db;

        // If a second instance of the same IndexedDB database performs an
        // upgrade operation, the `versionchange` event is fired. Then, close the
        // database to allow the external upgrade to proceed.
        db.onversionchange = function () {
          if (db) {
            db.close();
            db = null;
            dbCache[_this.name] = null;
          }
        };

        // Try to obtain the collection handle by recursing. Append the handlers
        // to empty the queue upon success and failure. Set the `force` flag so
        // all but the current transaction remain queued.
        var wrap = function wrap(done) {
          var callbackFn = function callbackFn(arg) {
            done(arg);

            // Switch flag
            _this.inTransaction = false;

            // The database handle has been established, we can now safely empty
            // the queue. The queue must be emptied before invoking the concurrent
            // operations to avoid infinite recursion.
            if (_this.queue.length > 0) {
              var pending = _this.queue;
              _this.queue = [];
              (0, _forEach2.default)(pending, function (fn) {
                fn.call(_this);
              });
            }
          };
          return callbackFn;
        };

        return _this.openTransaction(collection, write, wrap(success), wrap(error), true);
      };

      request.onblocked = function () {
        error(new Error('The ' + _this.name + ' IndexedDB database version can\'t be upgraded' + ' because the database is already open.'));
      };

      request.onerror = function (e) {
        error(new Error('Unable to open the ' + _this.name + ' IndexedDB database.' + (' ' + e.target.error.message + '.')));
      };

      return request;
    }
  }, {
    key: 'find',
    value: function find(collection) {
      var _this2 = this;

      return new _es6Promise2.default(function (resolve, reject) {
        _this2.openTransaction(collection, false, function (txn) {
          var store = txn.objectStore(collection);
          var request = store.openCursor();
          var entities = [];

          request.onsuccess = function (e) {
            var cursor = e.target.result;

            if (cursor) {
              entities.push(cursor.value);
              return cursor.continue();
            }

            return resolve(entities);
          };

          request.onerror = function (e) {
            reject(e);
          };
        }, reject);
      });
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      var _this3 = this;

      return new _es6Promise2.default(function (resolve, reject) {
        _this3.openTransaction(collection, false, function (txn) {
          var store = txn.objectStore(collection);
          var request = store.get(id);

          request.onsuccess = function (e) {
            var entity = e.target.result;

            if (entity) {
              resolve(entity);
            } else {
              reject(new _errors.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this3.name + ' IndexedDB database.')));
            }
          };

          request.onerror = function () {
            reject(new _errors.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this3.name + ' IndexedDB database.')));
          };
        }, reject);
      });
    }
  }, {
    key: 'save',
    value: function save(collection, entities) {
      var _this4 = this;

      var singular = false;

      if (!(0, _isArray2.default)(entities)) {
        singular = true;
        entities = [entities];
      }

      if (entities.length === 0) {
        return _es6Promise2.default.resolve(null);
      }

      return new _es6Promise2.default(function (resolve, reject) {
        _this4.openTransaction(collection, true, function (txn) {
          var store = txn.objectStore(collection);

          (0, _forEach2.default)(entities, function (entity) {
            store.put(entity);
          });

          txn.oncomplete = function () {
            resolve(singular ? entities[0] : entities);
          };

          txn.onerror = function (e) {
            reject(new Error('An error occurred while saving the entities to the ' + collection + (' collection on the ' + _this4.name + ' IndexedDB database. ' + e.target.error.message + '.')));
          };
        }, reject);
      });
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this5 = this;

      return new _es6Promise2.default(function (resolve, reject) {
        _this5.openTransaction(collection, true, function (txn) {
          var store = txn.objectStore(collection);
          var request = store.get(id);
          store.delete(id);

          txn.oncomplete = function () {
            var entity = request.result;

            if (entity) {
              resolve(entity);
            } else {
              reject(new _errors.NotFoundError('An entity with id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this5.name + ' IndexedDB database.')));
            }
          };

          txn.onerror = function () {
            reject(new _errors.NotFoundError('An entity with id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this5.name + ' IndexedDB database.')));
          };
        }, reject);
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this6 = this;

      return new _es6Promise2.default(function (resolve, reject) {
        var indexedDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB;
        var request = indexedDB.deleteDatabase(_this6.name);

        request.onsuccess = function () {
          dbCache = {};
          resolve();
        };

        request.onerror = function (e) {
          reject(new Error('An error occurred while clearing the ' + _this6.name + ' IndexedDB database.' + (' ' + e.target.error.message + '.')));
        };
      });
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      var indexedDB = global.indexedDB || global.webkitIndexedDB || global.mozIndexedDB || global.msIndexedDB;
      return typeof indexedDB !== 'undefined';
    }
  }]);

  return IndexedDB;
}();

exports.default = IndexedDB;