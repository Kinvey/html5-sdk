'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Helper function to detect the browser name and version.
function browserDetect(ua) {
  // Cast arguments.
  ua = ua.toLowerCase();

  // User-Agent patterns.
  var rChrome = /(chrome)\/([\w]+)/;
  var rFirefox = /(firefox)\/([\w.]+)/;
  var rIE = /(msie) ([\w.]+)/i;
  var rOpera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
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

var Device = function () {
  function Device() {
    _classCallCheck(this, Device);
  }

  _createClass(Device, null, [{
    key: 'toString',
    value: function toString() {
      return deviceInformation();
    }
  }]);

  return Device;
}();

exports.default = Device;