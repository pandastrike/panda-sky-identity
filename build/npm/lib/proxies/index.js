"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _frictionless = require("./frictionless");

var _frictionless2 = _interopRequireDefault(_frictionless);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Proxies;

Proxies = function (liftedAWS, environment) {
  return Object.defineProperties({}, {
    frictionless: {
      enumerable: true,
      get: function () {
        return (0, _frictionless2.default)(liftedAWS, environment);
      }
    }
  });
};

exports.default = Proxies;