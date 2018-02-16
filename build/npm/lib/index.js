"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxies = undefined;

var _sundog = require("sundog");

var _sundog2 = _interopRequireDefault(_sundog);

var _proxies = require("./proxies");

var _proxies2 = _interopRequireDefault(_proxies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The identity helper makes it easy to create client proxies within your API to manage user authorization and authentication.
var Identity, proxies;

exports.proxies = proxies = function (sdk, environment) {
  return (0, _proxies2.default)((0, _sundog2.default)(sdk)._AWS, environment);
};

Identity = { proxies };

exports.default = Identity;
exports.proxies = proxies;