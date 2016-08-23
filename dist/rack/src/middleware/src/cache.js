'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CacheMiddleware = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _middleware = require('kinvey-javascript-rack/dist/middleware');

var _db = require('./db');

var _errors = require('kinvey-javascript-sdk-core/dist/errors');

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // eslint-disable-line no-unused-vars


var dbCache = {};

var CacheMiddleware = exports.CacheMiddleware = function (_Middleware) {
  _inherits(CacheMiddleware, _Middleware);

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
        db = new _db.DB(name);
      }

      return db;
    }
  }, {
    key: 'handle',
    value: function () {
      var _ref = _asyncToGenerator(_regeneratorRuntime2.default.mark(function _callee(request) {
        var method, query, body, appKey, collection, entityId, client, db, data, response;
        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                method = request.method;
                query = request.query;
                body = request.body;
                appKey = request.appKey;
                collection = request.collection;
                entityId = request.entityId;
                client = request.client;
                db = this.openDatabase(appKey, client ? client.encryptionKey : undefined);
                data = void 0;

                if (!(method === 'GET')) {
                  _context.next = 33;
                  break;
                }

                if (!entityId) {
                  _context.next = 28;
                  break;
                }

                if (!(entityId === '_count')) {
                  _context.next = 17;
                  break;
                }

                _context.next = 14;
                return db.count(collection, query);

              case 14:
                data = _context.sent;
                _context.next = 26;
                break;

              case 17:
                if (!(entityId === '_group')) {
                  _context.next = 23;
                  break;
                }

                _context.next = 20;
                return db.group(collection, body);

              case 20:
                data = _context.sent;
                _context.next = 26;
                break;

              case 23:
                _context.next = 25;
                return db.findById(collection, entityId);

              case 25:
                data = _context.sent;

              case 26:
                _context.next = 31;
                break;

              case 28:
                _context.next = 30;
                return db.find(collection, query);

              case 30:
                data = _context.sent;

              case 31:
                _context.next = 55;
                break;

              case 33:
                if (!(method === 'POST' || method === 'PUT')) {
                  _context.next = 39;
                  break;
                }

                _context.next = 36;
                return db.save(collection, body);

              case 36:
                data = _context.sent;
                _context.next = 55;
                break;

              case 39:
                if (!(method === 'DELETE')) {
                  _context.next = 55;
                  break;
                }

                if (!(collection && entityId)) {
                  _context.next = 46;
                  break;
                }

                _context.next = 43;
                return db.removeById(collection, entityId);

              case 43:
                data = _context.sent;
                _context.next = 55;
                break;

              case 46:
                if (collection) {
                  _context.next = 52;
                  break;
                }

                _context.next = 49;
                return db.clear();

              case 49:
                data = _context.sent;
                _context.next = 55;
                break;

              case 52:
                _context.next = 54;
                return db.remove(collection, query);

              case 54:
                data = _context.sent;

              case 55:
                response = {
                  statusCode: method === 'POST' ? 201 : 200,
                  headers: {},
                  data: data
                };


                if (!data || (0, _isEmpty2.default)(data)) {
                  response.statusCode = 204;
                }

                return _context.abrupt('return', { response: response });

              case 58:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handle(_x) {
        return _ref.apply(this, arguments);
      }

      return handle;
    }()
  }]);

  return CacheMiddleware;
}(_middleware.Middleware);