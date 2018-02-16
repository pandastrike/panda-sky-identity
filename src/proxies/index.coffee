import frictionless from "./frictionless"

Proxies = (liftedAWS, environment) ->
  Object.defineProperties {},
    frictionless:
      enumerable: true
      get: -> frictionless liftedAWS, environment

export default Proxies
