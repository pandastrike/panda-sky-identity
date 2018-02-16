"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmontHelpers = require("fairmont-helpers");

var _keyForge = require("key-forge");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Frictionless is a Panda Sky Cognito mixin preset that automates the generation and entry of a password so the end user only deals with multi-factor authentication to get unguessable keys on their device.
var frictionless;

frictionless = function (liftedAWS, env) {
  var assignAttributes, clientID, cog, confirm, login, poolID, refreshLogin, register, respond, validateMFA;
  cog = liftedAWS.CognitoIdentityServiceProvider;
  poolID = env.mixinCognitoPoolID;
  clientID = env.mixinCognitoClientID;
  assignAttributes = function (config) {
    var attributes, n, v;
    if (!config.email && !config.phone_number) {
      throw new Error("Must provide email and/or phone_number for registration.");
    }
    attributes = [];
    for (n in config) {
      v = config[n];
      if (n !== "username") {
        attributes.push({
          Name: n,
          Value: v
        });
      }
    }
    return attributes;
  };
  register = (() => {
    var _ref = _asyncToGenerator(function* (attributes, options = {}) {
      var params, password;
      password = (0, _keyForge.randomKey)(16, "base64url");
      attributes["custom:password"] = password;
      params = {
        Username: attributes.username,
        Password: password,
        ClientId: clientID,
        UserAttributes: assignAttributes(attributes)
      };
      params = (0, _fairmontHelpers.merge)(params, options);
      return {
        password,
        registrationDetails: yield cog.signUp(params)
      };
    });

    return function register(_x) {
      return _ref.apply(this, arguments);
    };
  })();
  confirm = (() => {
    var _ref2 = _asyncToGenerator(function* (username, code, options = {}) {
      var params;
      params = {
        Username: username,
        ConfirmationCode: code,
        ClientId: clientID
      };
      params = (0, _fairmontHelpers.merge)(params, options);
      return yield cog.confirmSignUp(params);
    });

    return function confirm(_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  })();
  login = (() => {
    var _ref3 = _asyncToGenerator(function* ({ username, password, key }, options = {}) {
      var params;
      params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: clientID,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        }
      };
      if (key) {
        params.AuthParameters.DEVICE_KEY = key;
      }
      params = (0, _fairmontHelpers.merge)(params, options);
      return yield cog.initiateAuth(params);
    });

    return function login(_x4) {
      return _ref3.apply(this, arguments);
    };
  })();
  respond = (() => {
    var _ref4 = _asyncToGenerator(function* (challenge, response, options = {}) {
      var params;
      params = {
        ChallengeName: challenge.ChallengeName,
        ClientId: clientID,
        ChallengeResponses: response,
        Session: challenge.Session
      };
      params = (0, _fairmontHelpers.merge)(params, options);
      return yield cog.respondToAuthChallenge(params);
    });

    return function respond(_x5, _x6) {
      return _ref4.apply(this, arguments);
    };
  })();
  validateMFA = (() => {
    var _ref5 = _asyncToGenerator(function* (challenge, code, options = {}) {
      var response;
      response = {
        SMS_MFA_CODE: code,
        USERNAME: challenge.ChallengeParameters.USER_ID_FOR_SRP
      };
      return yield respond(challenge, response, options);
    });

    return function validateMFA(_x7, _x8) {
      return _ref5.apply(this, arguments);
    };
  })();
  refreshLogin = function (username, password, options = {}) {
    return login = function (username, password, options = {}) {};
  };
  // params =
  //   AuthFlow: USER_SRP_AUTH | REFRESH_TOKEN_AUTH | REFRESH_TOKEN | CUSTOM_AUTH | ADMIN_NO_SRP_AUTH | USER_PASSWORD_AUTH, /* required */
  //   ClientId: 'STRING_VALUE', /* required */
  //   AnalyticsMetadata: {
  //     AnalyticsEndpointId: 'STRING_VALUE'
  //   },
  //   AuthParameters: {
  //     '<StringType>': 'STRING_VALUE',
  //     /* '<StringType>': ... */
  //   },
  //   ClientMetadata: {
  //     '<StringType>': 'STRING_VALUE',
  //     /* '<StringType>': ... */
  //   },
  //   UserContextData: {
  //     EncodedData: 'STRING_VALUE'
  //   }
  // await cog.initiateAuth params
  return { register, confirm, login, respond, validateMFA };
};

exports.default = frictionless;