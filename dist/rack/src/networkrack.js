'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkRack = undefined;

var _rack = require('./rack');

var _middleware = require('./middleware');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NetworkRack = exports.NetworkRack = function (_Rack) {
  _inherits(NetworkRack, _Rack);

  function NetworkRack() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'Network Rack' : arguments[0];

    _classCallCheck(this, NetworkRack);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NetworkRack).call(this, name));

    _this.use(new _middleware.SerializeMiddleware());
    _this.use(new _middleware.HttpMiddleware());
    _this.use(new _middleware.ParseMiddleware());
    return _this;
  }

  return NetworkRack;
}(_rack.Rack);