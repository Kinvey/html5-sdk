'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 */

var PopupAdapter = exports.PopupAdapter = function () {
  function PopupAdapter() {
    _classCallCheck(this, PopupAdapter);
  }

  _createClass(PopupAdapter, [{
    key: 'isOpen',
    value: function isOpen() {
      return !!this._open;
    }
  }, {
    key: 'open',
    value: function open() {
      var _this = this;

      var promise = new Promise(function (resolve, reject) {
        if (_this.isOpen()) {
          return reject(new Error('Popup is already open.'));
        }

        _this.popup = global.open(_this.url, '_blank', 'toolbar=no,location=no');

        if (_this.popup) {
          (function () {
            _this._open = true;
            var interval = setInterval(function () {
              if (_this.popup.closed) {
                _this._open = false;
                clearTimeout(interval);
                _this.emit('closed');
              } else {
                try {
                  _this.emit('loaded', _this.popup.location.href);
                } catch (e) {
                  // catch any errors due to cross domain issues
                }
              }
            }, 100);
          })();
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
  }]);

  return PopupAdapter;
}();