'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Device = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = require('json-loader!../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 */

var Device = exports.Device = function () {
  function Device() {
    _classCallCheck(this, Device);
  }

  _createClass(Device, [{
    key: 'toJSON',
    value: function toJSON() {
      var userAgent = global.navigator.userAgent.toLowerCase();
      var rChrome = /(chrome)\/([\w]+)/;
      var rFirefox = /(firefox)\/([\w.]+)/;
      var rIE = /(msie) ([\w.]+)/i;
      var rOpera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
      var rSafari = /(safari)\/([\w.]+)/;
      var browser = rChrome.exec(userAgent) || rFirefox.exec(userAgent) || rIE.exec(userAgent) || rOpera.exec(userAgent) || rSafari.exec(userAgent) || [];

      return {
        environment: 'html5',
        library: {
          name: 'html5'
        },
        os: {
          name: browser[1],
          version: browser[2]
        },
        sdk: {
          name: _package2.default.name,
          version: _package2.default.version
        }
      };
    }
  }]);

  return Device;
}();