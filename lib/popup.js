'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _bind = require('lodash/bind');

var _bind2 = _interopRequireDefault(_bind);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popup = function (_EventEmitter) {
  _inherits(Popup, _EventEmitter);

  function Popup() {
    _classCallCheck(this, Popup);

    return _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).apply(this, arguments));
  }

  _createClass(Popup, [{
    key: 'open',
    value: function open() {
      var _this2 = this;

      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

      var interval = void 0;
      var eventListeners = void 0;
      var popupWindow = void 0;

      // loadStartCallback
      var loadStartCallback = function loadStartCallback(event) {
        _this2.emit('loadstart', event);
      };

      // loadStopCallback
      var loadStopCallback = function loadStopCallback(event) {
        _this2.emit('loadstop', event);
      };

      // loadErrorCallback
      var loadErrorCallback = function loadErrorCallback(event) {
        _this2.emit('error', event);
      };

      // exitCallback
      var exitCallback = function exitCallback() {
        // Clear the interval
        clearInterval(interval);

        // Close the popup
        popupWindow.close();
        _this2.popupWindow = null;

        // Remove event listeners
        if (popupWindow && (0, _isFunction2.default)(popupWindow.removeEventListener)) {
          popupWindow.removeEventListener('loadstart', eventListeners.loadStopCallback);
          popupWindow.removeEventListener('loadstop', eventListeners.loadStopCallback);
          popupWindow.removeEventListener('loaderror', eventListeners.loadErrorCallback);
          popupWindow.removeEventListener('exit', eventListeners.exitCallback);
        }

        // Emit closed
        _this2.emit('exit');
      };

      // Bind event listeners
      eventListeners = {
        loadStartCallback: (0, _bind2.default)(loadStartCallback, this),
        loadStopCallback: (0, _bind2.default)(loadStopCallback, this),
        loadErrorCallback: (0, _bind2.default)(loadErrorCallback, this),
        exitCallback: (0, _bind2.default)(exitCallback, this)
      };

      // Open the popup
      popupWindow = global.open(url, '_blank', 'toolbar=no,location=no');

      if (popupWindow) {
        if ((0, _isFunction2.default)(popupWindow.addEventListener)) {
          popupWindow.addEventListener('loadstart', eventListeners.loadStartCallback);
          popupWindow.addEventListener('loadstop', eventListeners.loadStopCallback);
          popupWindow.addEventListener('loaderror', eventListeners.loadErrorCallback);
          popupWindow.addEventListener('exit', eventListeners.exitCallback);
        }

        // Check if the popup is closed has closed every 100ms
        interval = setInterval(function () {
          if (popupWindow.closed) {
            eventListeners.exitCallback();
          } else {
            try {
              eventListeners.loadStopCallback({
                url: popupWindow.location.href
              });
            } catch (error) {
              // Just catch the error
            }
          }
        }, 100);
      } else {
        throw new Error('The popup was blocked.');
      }

      // Set the popupWindow instance
      this.popupWindow = popupWindow;

      // Return this
      return this;
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.popupWindow) {
        this.popupWindow.close();
      }

      return this;
    }
  }]);

  return Popup;
}(_events.EventEmitter);

exports.default = Popup;