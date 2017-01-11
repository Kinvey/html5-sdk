'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieStorage = exports.SessionStorage = exports.LocalStorage = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _export = require('kinvey-node-sdk/lib/export');

var _es6Promise = require('es6-promise');

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _keyBy = require('lodash/keyBy');

var _keyBy2 = _interopRequireDefault(_keyBy);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _forEach = require('lodash/forEach');

var _forEach2 = _interopRequireDefault(_forEach);

var _findIndex = require('lodash/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var idAttribute = process && process.env && process.env.KINVEY_ID_ATTRIBUTE || '_id' || '_id';
var masterCollectionName = 'master';

var WebStorage = function () {
  function WebStorage() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'kinvey';

    _classCallCheck(this, WebStorage);

    this.name = name;
  }

  _createClass(WebStorage, [{
    key: 'masterCollectionName',
    get: function get() {
      return this.name + '_' + masterCollectionName;
    }
  }]);

  return WebStorage;
}();

exports.default = WebStorage;

var LocalStorage = exports.LocalStorage = function (_WebStorage) {
  _inherits(LocalStorage, _WebStorage);

  function LocalStorage(name) {
    _classCallCheck(this, LocalStorage);

    var _this = _possibleConstructorReturn(this, (LocalStorage.__proto__ || Object.getPrototypeOf(LocalStorage)).call(this, name));

    global.localStorage.setItem(_this.masterCollectionName, JSON.stringify([]));
    return _this;
  }

  _createClass(LocalStorage, [{
    key: '_find',
    value: function _find(collection) {
      try {
        var entities = global.localStorage.getItem(collection);

        if (entities) {
          return _es6Promise2.default.resolve(JSON.parse(entities));
        }

        return _es6Promise2.default.resolve(entities || []);
      } catch (error) {
        return _es6Promise2.default.reject(error);
      }
    }
  }, {
    key: 'find',
    value: function find(collection) {
      return this._find('' + this.name + collection);
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      var _this2 = this;

      return this.find(collection).then(function (entities) {
        var entity = (0, _find3.default)(entities, function (entity) {
          return entity[idAttribute] === id;
        });

        if (!entity) {
          throw new _export.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this2.name + ' localstorage database.'));
        }

        return entity;
      });
    }
  }, {
    key: 'save',
    value: function save(collection, entities) {
      var _this3 = this;

      return this._find(this.masterCollectionName).then(function (collections) {
        if ((0, _findIndex2.default)(collections, collection) === -1) {
          collections.push(collection);
          global.localStorage.setItem(_this3.masterCollectionName, JSON.stringify(collections));
        }

        return _this3.find(collection);
      }).then(function (existingEntities) {
        var existingEntitiesById = (0, _keyBy2.default)(existingEntities, idAttribute);
        var entitiesById = (0, _keyBy2.default)(entities, idAttribute);
        var existingEntityIds = Object.keys(existingEntitiesById);

        (0, _forEach2.default)(existingEntityIds, function (id) {
          var existingEntity = existingEntitiesById[id];
          var entity = entitiesById[id];

          if (entity) {
            entitiesById[id] = (0, _merge2.default)(existingEntity, entity);
          }
        });

        global.localStorage.setItem('' + _this3.name + collection, JSON.stringify((0, _values2.default)(entitiesById)));
        return entities;
      });
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this4 = this;

      return this.find(collection).then(function (entities) {
        var entitiesById = (0, _keyBy2.default)(entities, idAttribute);
        var entity = entitiesById[id];

        if (!entity) {
          throw new _export.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + ' ' + ('collection on the ' + _this4.name + ' memory database.'));
        }

        delete entitiesById[id];
        return _this4.save(collection, (0, _values2.default)(entitiesById)).then(function () {
          return entity;
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this5 = this;

      return this._find(this.masterCollectionName).then(function (collections) {
        (0, _forEach2.default)(collections, function (collection) {
          global.localStorage.removeItem('' + _this5.name + collection);
        });

        global.localStorage.setItem(_this5.masterCollectionName, JSON.stringify([]));
        return null;
      });
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      if (global.localStorage) {
        var item = 'testLocalStorageSupport';
        try {
          global.localStorage.setItem(item, item);
          global.localStorage.getItem(item);
          global.localStorage.removeItem(item);
          return _es6Promise2.default.resolve(true);
        } catch (e) {
          return _es6Promise2.default.resolve(false);
        }
      }

      return _es6Promise2.default.resolve(false);
    }
  }]);

  return LocalStorage;
}(WebStorage);

var SessionStorage = exports.SessionStorage = function (_WebStorage2) {
  _inherits(SessionStorage, _WebStorage2);

  function SessionStorage(name) {
    _classCallCheck(this, SessionStorage);

    var _this6 = _possibleConstructorReturn(this, (SessionStorage.__proto__ || Object.getPrototypeOf(SessionStorage)).call(this, name));

    global.sessionStorage.setItem(_this6.masterCollectionName, JSON.stringify([]));
    return _this6;
  }

  _createClass(SessionStorage, [{
    key: '_find',
    value: function _find(collection) {
      try {
        var entities = global.localStorage.getItem(collection);

        if (entities) {
          return _es6Promise2.default.resolve(JSON.parse(entities));
        }

        return _es6Promise2.default.resolve(entities || []);
      } catch (error) {
        return _es6Promise2.default.reject(error);
      }
    }
  }, {
    key: 'find',
    value: function find(collection) {
      return this._find('' + this.name + collection);
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      var _this7 = this;

      return this.find(collection).then(function (entities) {
        var entity = (0, _find3.default)(entities, function (entity) {
          return entity[idAttribute] === id;
        });

        if (!entity) {
          throw new _export.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this7.name + ' localstorage database.'));
        }

        return entity;
      });
    }
  }, {
    key: 'save',
    value: function save(collection, entities) {
      var _this8 = this;

      return this._find(this.masterCollectionName).then(function (collections) {
        if ((0, _findIndex2.default)(collections, collection) === -1) {
          collections.push(collection);
          global.sessionStorage.setItem(_this8.masterCollectionName, JSON.stringify(collections));
        }

        return _this8.find(collection);
      }).then(function (existingEntities) {
        var existingEntitiesById = (0, _keyBy2.default)(existingEntities, idAttribute);
        var entitiesById = (0, _keyBy2.default)(entities, idAttribute);
        var existingEntityIds = Object.keys(existingEntitiesById);

        (0, _forEach2.default)(existingEntityIds, function (id) {
          var existingEntity = existingEntitiesById[id];
          var entity = entitiesById[id];

          if (entity) {
            entitiesById[id] = (0, _merge2.default)(existingEntity, entity);
          }
        });

        global.sessionStorage.setItem('' + _this8.name + collection, JSON.stringify((0, _values2.default)(entitiesById)));
        return entities;
      });
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this9 = this;

      return this.find(collection).then(function (entities) {
        var entitiesById = (0, _keyBy2.default)(entities, idAttribute);
        var entity = entitiesById[id];

        if (!entity) {
          throw new _export.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + ' ' + ('collection on the ' + _this9.name + ' memory database.'));
        }

        delete entitiesById[id];
        return _this9.save(collection, (0, _values2.default)(entitiesById)).then(function () {
          return entity;
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this10 = this;

      return this._find(this.masterCollectionName).then(function (collections) {
        (0, _forEach2.default)(collections, function (collection) {
          global.sessionStorage.removeItem('' + _this10.name + collection);
        });

        global.sessionStorage.setItem(_this10.masterCollectionName, JSON.stringify([]));
        return null;
      });
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      if (global.sessionStorage) {
        var item = 'testSessionStorageSupport';
        try {
          global.sessionStorage.setItem(item, item);
          gloabl.sessionStorage.getItem(item);
          global.sessionStorage.removeItem(item);
          return _es6Promise2.default.resolve(true);
        } catch (e) {
          return _es6Promise2.default.resolve(false);
        }
      }

      return _es6Promise2.default.resolve(false);
    }
  }]);

  return SessionStorage;
}(WebStorage);

var CookieStorage = exports.CookieStorage = function (_WebStorage3) {
  _inherits(CookieStorage, _WebStorage3);

  function CookieStorage(name) {
    _classCallCheck(this, CookieStorage);

    var _this11 = _possibleConstructorReturn(this, (CookieStorage.__proto__ || Object.getPrototypeOf(CookieStorage)).call(this, name));

    var expires = new Date();
    expires.setTime(expires.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // Expire in 100 years
    global.document.cookie = _this11.masterCollectionName + '=' + encodeURIComponent(JSON.stringify([])) + '; expires=' + expires.toUTCString() + '; path=/';
    return _this11;
  }

  _createClass(CookieStorage, [{
    key: '_find',
    value: function _find(collection) {
      var values = document.cookie.split(';');
      for (var i = 0, len = values.length; i < len; i += 1) {
        var value = values[i];
        while (value.charAt(0) === ' ') {
          value = value.substring(1);
        }
        if (value.indexOf(collection) === 0) {
          return _es6Promise2.default.resolve(JSON.parse(decodeURIComponent(value.substring(collection.length, value.length))));
        }
      }
      return _es6Promise2.default.resolve([]);
    }
  }, {
    key: 'find',
    value: function find(collection) {
      return this._find('' + this.name + collection);
    }
  }, {
    key: 'findById',
    value: function findById(collection, id) {
      var _this12 = this;

      return this.find(collection).then(function (entities) {
        var entity = (0, _find3.default)(entities, function (entity) {
          return entity[idAttribute] === id;
        });

        if (!entity) {
          throw new _export.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + (' collection on the ' + _this12.name + ' localstorage database.'));
        }

        return entity;
      });
    }
  }, {
    key: 'save',
    value: function save(collection, entities) {
      var _this13 = this;

      return this._find(this.masterCollectionName).then(function (collections) {
        if ((0, _findIndex2.default)(collections, collection) === -1) {
          collections.push(collection);
          var expires = new Date();
          expires.setTime(expires.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // Expire in 100 years
          global.document.cookie = _this13.masterCollectionName + '=' + encodeURIComponent(JSON.stringify(collections)) + '; expires=' + expires.toUTCString() + '; path=/';
        }

        return _this13.find(collection);
      }).then(function (existingEntities) {
        var existingEntitiesById = (0, _keyBy2.default)(existingEntities, idAttribute);
        var entitiesById = (0, _keyBy2.default)(entities, idAttribute);
        var existingEntityIds = Object.keys(existingEntitiesById);

        (0, _forEach2.default)(existingEntityIds, function (id) {
          var existingEntity = existingEntitiesById[id];
          var entity = entitiesById[id];

          if (entity) {
            entitiesById[id] = (0, _merge2.default)(existingEntity, entity);
          }
        });

        var expires = new Date();
        expires.setTime(expires.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // Expire in 100 years
        global.document.cookie = '' + _this13.name + collection + '=' + encodeURIComponent(JSON.stringify((0, _values2.default)(entitiesById))) + '; expires=' + expires.toUTCString() + '; path=/';
        return entities;
      });
    }
  }, {
    key: 'removeById',
    value: function removeById(collection, id) {
      var _this14 = this;

      return this.find(collection).then(function (entities) {
        var entitiesById = (0, _keyBy2.default)(entities, idAttribute);
        var entity = entitiesById[id];

        if (!entity) {
          throw new _export.NotFoundError('An entity with _id = ' + id + ' was not found in the ' + collection + ' ' + ('collection on the ' + _this14.name + ' memory database.'));
        }

        delete entitiesById[id];
        return _this14.save(collection, (0, _values2.default)(entitiesById)).then(function () {
          return entity;
        });
      });
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _this15 = this;

      return this._find(this.masterCollectionName).then(function (collections) {
        (0, _forEach2.default)(collections, function (collection) {
          var expires = new Date();
          expires.setTime(expires.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // Expire in 100 years
          global.document.cookie = '' + _this15.name + collection + '=' + encodeURIComponent() + '; expires=' + expires.toUTCString() + '; path=/';
        });

        var expires = new Date();
        expires.setTime(expires.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // Expire in 100 years
        global.document.cookie = _this15.masterCollectionName + '=' + encodeURIComponent(JSON.stringify([])) + '; expires=' + expires.toUTCString() + '; path=/';
        return null;
      });
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      return _es6Promise2.default.resolve(typeof global.document.cookie !== 'undefined');
    }
  }]);

  return CookieStorage;
}(WebStorage);