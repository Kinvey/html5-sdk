'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Kinvey = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _kinveyJavascriptSdkCore = require('kinvey-javascript-sdk-core');

var _es6Promise = require('es6-promise');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Kinvey = exports.Kinvey = function (_CoreKinvey) {
  _inherits(Kinvey, _CoreKinvey);

  function Kinvey() {
    _classCallCheck(this, Kinvey);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Kinvey).apply(this, arguments));
  }

  _createClass(Kinvey, null, [{
    key: 'Promise',

    /**
     * Returns the Promise class.
     *
     * @return {Promise} The Promise class.
     *
     * @example
     * var Promise = Kinvey.Promise;
     */
    get: function get() {
      return _es6Promise.Promise;
    }
  }]);

  return Kinvey;
}(_kinveyJavascriptSdkCore.Kinvey);