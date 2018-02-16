# Frictionless is a Panda Sky Cognito mixin preset that automates the generation and entry of a password so the end user only deals with multi-factor authentication to get unguessable keys on their device.
import {merge} from "fairmont-helpers"
import {randomKey} from "key-forge"

frictionless = (liftedAWS, env) ->
  cog = liftedAWS.CognitoIdentityServiceProvider
  poolID = env.mixinCognitoPoolID
  clientID = env.mixinCognitoClientID

  assignAttributes = (config) ->
    if !config.email && !config.phone_number
      throw new Error "Must provide email and/or phone_number for registration."
    attributes = []
    attributes.push {Name: n, Value: v} for n, v of config when n != "username"
    attributes

  register = (attributes, options={}) ->
    password = randomKey 16, "base64url"
    attributes["custom:password"] = password
    params =
      Username: attributes.username
      Password: password
      ClientId: clientID
      UserAttributes: assignAttributes attributes
    params = merge params, options

    {
      password,
      registrationDetails: await cog.signUp params
    }

  confirm = (username, code, options={}) ->
    params =
      Username: username
      ConfirmationCode: code
      ClientId: clientID
    params = merge params, options
    await cog.confirmSignUp params

  startAuthFlow = (flow, data, options={}) ->
    params =
      AuthFlow: flow
      ClientId: clientID
      AuthParameters: data
    params = merge params, options
    await cog.initiateAuth params

  login = ({username, password, key}, options={}) ->
    data =
      USERNAME: username
      PASSWORD: password
    data.DEVICE_KEY = key if key
    await startAuthFlow "USER_PASSWORD_AUTH", data, options

  refresh = (token, key, options={}) ->
    data =
      REFRESH_TOKEN: token
      DEVICE_KEY: key
    await startAuthFlow "REFRESH_TOKEN", data, options

  respond = (challenge, response, options={}) ->
    params =
      ChallengeName: challenge.ChallengeName
      ClientId: clientID
      ChallengeResponses: response
      Session: challenge.Session
    params = merge params, options
    await cog.respondToAuthChallenge params

  validateMFA = (challenge, code, options={}) ->
    response =
      SMS_MFA_CODE: code
      USERNAME: challenge.ChallengeParameters.USER_ID_FOR_SRP
    await respond challenge, response, options

  refreshLogin = (username, password, options={}) ->
    login = (username, password, options={}) ->
      # params =
      #   AuthFlow: USER_SRP_AUTH | REFRESH_TOKEN_AUTH | REFRESH_TOKEN | CUSTOM_AUTH | ADMIN_NO_SRP_AUTH | USER_PASSWORD_AUTH, /* required */
      #   ClientId: 'STRING_VALUE', /* required */
      #   AnalyticsMetadata: {
      #     AnalyticsEndpointId: 'STRING_VALUE'
      #   },
      #   AuthParameters: {
      #     '<StringType>': 'STRING_VALUE',
      #     /* '<StringType>': ... */
      #   },
      #   ClientMetadata: {
      #     '<StringType>': 'STRING_VALUE',
      #     /* '<StringType>': ... */
      #   },
      #   UserContextData: {
      #     EncodedData: 'STRING_VALUE'
      #   }
      # await cog.initiateAuth params


  {register, confirm, login, respond, validateMFA}

export default frictionless
