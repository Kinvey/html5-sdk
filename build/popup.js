'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 */

var Popup = exports.Popup = function () {
  function Popup() {
    _classCallCheck(this, Popup);
  }

  _createClass(Popup, [{
    key: 'open',
    value: function open() {
      var _this = this;

      var promise = new Promise(function (resolve, reject) {
        _this.popup = global.open(_this.url, '_blank', 'toolbar=no,location=no');

        if (_this.popup) {
          _this.interval = setInterval(function () {
            if (_this.popup.closed) {
              _this.closeHandler();
            } else {
              try {
                _this.loadHandler({
                  url: _this.popup.location.href
                });
              } catch (e) {
                // catch any errors due to cross domain issues
              }
            }
          }, 100);
        } else {
          return reject(new Error('The popup was blocked.'));
        }

        return resolve(_this);
      });

      return promise;
    }
  }, {
    key: 'close',
    value: function close() {
      var _this2 = this;

      var promise = new Promise(function (resolve) {
        if (_this2.popup) {
          _this2.popup.close();
        }
        resolve();
      });
      return promise;
    }
  }, {
    key: 'loadHandler',
    value: function loadHandler(event) {
      this.emit('loaded', event.url);
    }
  }, {
    key: 'clickHandler',
    value: function clickHandler() {
      this.close();
    }
  }, {
    key: 'closeHandler',
    value: function closeHandler() {
      clearTimeout(this.interval);
      this.emit('closed');
    }
  }]);

  return Popup;
}();