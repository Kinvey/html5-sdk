'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.deviceInformation = deviceInformation;

var _export = require('kinvey-node-sdk/lib/export');

var _package = require('../../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Helper function to detect the browser name and version.
function browserDetect(ua) {
  // Cast arguments.
  ua = ua.toLowerCase();

  // User-Agent patterns.
  var rChrome = /(chrome)\/([\w]+)/;
  var rFirefox = /(firefox)\/([\w.]+)/;
  var rIE = /(msie) ([\w.]+)/i;
  var rOpera = /(opera)(?:.*version)?[ /]([\w.]+)/;
  var rSafari = /(safari)\/([\w.]+)/;

  return rChrome.exec(ua) || rFirefox.exec(ua) || rIE.exec(ua) || rOpera.exec(ua) || rSafari.exec(ua) || [];
}

function deviceInformation() {
  var libraries = [];
  var browser = void 0;
  var platform = void 0;
  var version = void 0;
  var manufacturer = void 0;

  // Default platform, most likely this is just a plain web app.
  if ((platform === null || platform === undefined) && global.navigator) {
    browser = browserDetect(global.navigator.userAgent);
    platform = browser[1];
    version = browser[2];
    manufacturer = global.navigator.platform;
  }

  // Libraries.
  if (global.angular !== undefined) {
    // AngularJS.
    libraries.push('angularjs/' + global.angular.version.full);
  }
  if (global.Backbone !== undefined) {
    // Backbone.js.
    libraries.push('backbonejs/' + global.Backbone.VERSION);
  }
  if (global.Ember !== undefined) {
    // Ember.js.
    libraries.push('emberjs/' + global.Ember.VERSION);
  }
  if (global.jQuery !== undefined) {
    // jQuery.
    libraries.push('jquery/' + global.jQuery.fn.jquery);
  }
  if (global.ko !== undefined) {
    // Knockout.
    libraries.push('knockout/' + global.ko.version);
  }
  if (global.Zepto !== undefined) {
    // Zepto.js.
    libraries.push('zeptojs');
  }

  // Return the device information string.
  var parts = ['js-' + _package2.default.name + '/' + _package2.default.version];

  if (libraries.length !== 0) {
    // Add external library information.
    parts.push('(' + libraries.sort().join(', ') + ')');
  }

  return parts.concat([platform, version, manufacturer]).map(function (part) {
    if (part) {
      return part.toString().replace(/\s/g, '_').toLowerCase();
    }

    return 'unknown';
  }).join(' ');
}

var HTML5HttpMiddleware = function (_HttpMiddleware) {
  _inherits(HTML5HttpMiddleware, _HttpMiddleware);

  function HTML5HttpMiddleware() {
    _classCallCheck(this, HTML5HttpMiddleware);

    return _possibleConstructorReturn(this, (HTML5HttpMiddleware.__proto__ || Object.getPrototypeOf(HTML5HttpMiddleware)).apply(this, arguments));
  }

  _createClass(HTML5HttpMiddleware, [{
    key: 'deviceInformation',
    get: function get() {
      return deviceInformation();
    }
  }]);

  return HTML5HttpMiddleware;
}(_export.HttpMiddleware);

exports.default = HTML5HttpMiddleware;