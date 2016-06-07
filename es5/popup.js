'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Html5Popup = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Html5Popup = exports.Html5Popup = function (_EventEmitter) {
  _inherits(Html5Popup, _EventEmitter);

  function Html5Popup() {
    _classCallCheck(this, Html5Popup);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Html5Popup).apply(this, arguments));
  }

  _createClass(Html5Popup, [{
    key: 'open',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var url = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Open the popup
                this.popup = global.open(url, '_blank', 'toolbar=no,location=no');

                if (!this.popup) {
                  _context.next = 5;
                  break;
                }

                // Check if the popup is closed or redirect every 100ms
                this.interval = setInterval(function () {
                  if (_this2.popup.closed) {
                    _this2.exitCallback();
                  } else {
                    try {
                      _this2.loadStopCallback({
                        url: _this2.popup.location.href
                      });
                    } catch (error) {
                      // Just catch the error
                    }
                  }
                }, 100);
                _context.next = 6;
                break;

              case 5:
                throw new Error('The popup was blocked.');

              case 6:
                return _context.abrupt('return', this);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function open(_x) {
        return ref.apply(this, arguments);
      }

      return open;
    }()
  }, {
    key: 'close',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.popup) {
                  this.popup.close();
                }

                return _context2.abrupt('return', this);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function close() {
        return ref.apply(this, arguments);
      }

      return close;
    }()
  }, {
    key: 'loadStopCallback',
    value: function loadStopCallback(event) {
      this.emit('loaded', event.url);
    }
  }, {
    key: 'loadErrorCallback',
    value: function loadErrorCallback(event) {
      this.emit('error', event.message);
    }
  }, {
    key: 'exitCallback',
    value: function exitCallback() {
      clearInterval(this.interval);
      this.emit('closed');
    }
  }]);

  return Html5Popup;
}(_events.EventEmitter);