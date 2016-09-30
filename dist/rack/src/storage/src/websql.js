'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var idAttribute = process && process.env && process.env.KINVEY_ID_ATTRIBUTE || '_id' || '_id';
var masterCollectionName = 'sqlite_master';
var size = 5 * 1000 * 1000; // Database size in bytes
var dbCache = {};

var WebSQL = function () {
  function WebSQL() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'kinvey';

    _classCallCheck(this, WebSQL);

    this.name = name;
  }

  _createClass(WebSQL, [{
    key: 'openDatabase',
    value: function openDatabase() {
      var db = dbCache[this.name];

      if (!db) {
        db = global.openDatabase(this.name, 1, '', size);
        dbCache[this.name] = db;
      }

      return db;
    }
  }, {
    key: 'openTransaction',
    value: function openTransaction(collection, query, parameters) {
      var _this = this;

      var write = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      var db = this.openDatabase();
      var escapedCollection = '"' + collection + '"';
      var isMaster = collection === masterCollectionName;
      var isMulti = (0, _isArray2.default)(query);
      query = isMulti ? query : [[query, parameters]];

      var promise = new _es6Promise2.default(function (resolve, reject) {
        var writeTxn = write || !(0, _isFunction2.default)(db.readTransaction);
        db[writeTxn ? 'transaction' : 'readTransaction'](function (tx) {
          if (write && !isMaster) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + escapedCollection + ' ' + '(key BLOB PRIMARY KEY NOT NULL, value BLOB NOT NULL)');
          }

          var pending = query.length;
          var responses = [];

          if (pending === 0) {
            resolve(isMulti ? responses : responses.shift());
          } else {
            (0, _forEach2.default)(query, function (parts) {
              var sql = parts[0].replace('#{collection}', escapedCollection);

              tx.executeSql(sql, parts[1], function (_, resultSet) {
                var response = {
                  rowCount: resultSet.rowsAffected,
                  result: []
                };

                if (resultSet.rows.length) {
                  for (var i = 0, len = resultSet.rows.length; i < len; i += 1) {
                    try {
                      var value = resultSet.rows.item(i).value;
                      var entity = isMaster ? value : JSON.parse(value);
                      response.result.push(entity);
                    } catch (error) {
                      // Catch the error
                    }
                  }
                }

                responses.push(response);
                pending -= 1;

                if (pending === 0) {
                  resolve(isMulti ? responses : responses.shift());
                }
              });
            });
          }
        }, function (error) {
          error = (0, _isString2.default)(error) ? error : error.message;

          if (error && error.indexOf('no such table') === -1) {
            return reject(new _errors.NotFoundError('The ' + collection + ' collection was not found on' + (' the ' + _this.name + ' WebSQL database.')));
          }

          var query = 'SELECT name AS value from #{collection} WHERE type = ? AND name = ?';
          var parameters = ['table', collection];

          return _this.openTransaction(masterCollectionName, query, parameters).then(function (response) {
            if (response.result.length === 0) {
              return reject(new _errors.NotFoundError('The ' + collection + ' collection was not found on' + (' the ' + _this.name + ' WebSQL database.')));
            }

            return reject(new Error('Unable to open a transaction for the ' + collection + (' collection on the ' + _this.name + ' WebSQL database.')));
          }).catch(function (error) {
            reject(new Error('Unable to open a transaction for the ' + collection + (' collection on the ' + _this.name + ' WebSQL database.'), error));
          });
        });
      });

      return promise;
    }
  }, {
    key: 'find',
    value: function find(collection) {
      var sql = 'SELECT value FROM #{collection}';
      return this.openTransaction(collection, sql, []).then(function (response) {
        return response.result;
      });
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      var _this2 = this;

      var sql = 'SELECT value FROM #{collection} WHERE key = ?';
      return this.openTransaction(collection, sql, [id]).then(function (response) {
        return response.result;
      }).then(function (entities) {
        if (entities.length === 0) {
          throw new _errors.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this2.name + ' WebSQL database.'));
        }

        return entities[0];
      });
    }
  }, {
    key: 'save',
    value: function save(collection, entities) {
      var queries = [];
      entities = (0, _map2.default)(entities, function (entity) {
        queries.push(['REPLACE INTO #{collection} (key, value) VALUES (?, ?)', [entity[idAttribute], JSON.stringify(entity)]]);

        return entity;
      });

      return this.openTransaction(collection, queries, null, true).then(function () {
        return entities;
      });
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this3 = this;

      var queries = [['SELECT value FROM #{collection} WHERE key = ?', [id]], ['DELETE FROM #{collection} WHERE key = ?', [id]]];
      return this.openTransaction(collection, queries, null, true).then(function (response) {
        var entities = response[0].result;
        var count = response[1].rowCount;
        count = count || entities.length;

        if (count === 0) {
          throw new _errors.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this3.name + ' WebSQL database.'));
        }

        return entities[0];
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this4 = this;

      return this.openTransaction(masterCollectionName, 'SELECT name AS value FROM #{collection} WHERE type = ?', ['table'], false).then(function (response) {
        return response.result;
      }).then(function (tables) {
        // If there are no tables, return.
        if (tables.length === 0) {
          return null;
        }

        // Drop all tables. Filter tables first to avoid attempting to delete
        // system tables (which will fail).
        var queries = tables.filter(function (table) {
          return (/^[a-zA-Z0-9\-]{1,128}/.test(table)
          );
        }).map(function (table) {
          return ['DROP TABLE IF EXISTS \'' + table + '\''];
        });
        return _this4.openTransaction(masterCollectionName, queries, null, true);
      }).then(function () {
        dbCache = {};
        return null;
      });
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      return typeof global.openDatabase !== 'undefined';
    }
  }]);

  return WebSQL;
}();

exports.default = WebSQL;