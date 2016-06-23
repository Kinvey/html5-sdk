'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HttpMiddleware = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _middleware = require('kinvey-javascript-sdk-core/dist/rack/middleware');

var _es6Promise = require('es6-promise');

var _parseHeaders = require('parse-headers');

var _parseHeaders2 = _interopRequireDefault(_parseHeaders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpMiddleware = exports.HttpMiddleware = function (_KinveyMiddleware) {
  _inherits(HttpMiddleware, _KinveyMiddleware);

  function HttpMiddleware() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Kinvey HTML5 Http Middleware' : arguments[0];

    _classCallCheck(this, HttpMiddleware);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HttpMiddleware).call(this, name));
  }

  _createClass(HttpMiddleware, [{
    key: 'handle',
    value: function handle(request) {
      return _get(Object.getPrototypeOf(HttpMiddleware.prototype), 'handle', this).call(this, request).then(function () {
        var promise = new _es6Promise.Promise(function (resolve, reject) {
          var url = request.url;
          var method = request.method;
          var headers = request.headers;
          var body = request.body;

          // Create request

          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
          // xhr.responseType = request.responseType;

          // Append request headers
          var names = Object.keys(headers.toJSON());
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var name = _step.value;

              xhr.setRequestHeader(name, headers.get(name));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          xhr.onload = xhr.ontimeout = xhr.onabort = xhr.onerror = function () {
            // Extract status code
            var statusCode = xhr.status;

            // Extract the response
            var responseData = xhr.response || null;
            if (xhr.response) {
              responseData = xhr.responseText || null;
            }

            // Set the response for the request
            request.response = {
              statusCode: statusCode,
              headers: (0, _parseHeaders2.default)(xhr.getAllResponseHeaders()),
              data: responseData
            };

            // Success
            if (statusCode >= 200 && statusCode < 300 || statusCode === 304) {
              return resolve(request);
            }

            // Error
            return reject(request);
          };

          // Send xhr
          xhr.send(body);
        });
        return promise;
      });
    }
  }]);

  return HttpMiddleware;
}(_middleware.KinveyMiddleware);