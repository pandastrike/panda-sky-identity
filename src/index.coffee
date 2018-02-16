# The identity helper makes it easy to create client proxies within your API to manage user authorization and authentication.

import Sundog from "sundog"
import Proxies from "./proxies"

proxies = (sdk, environment) -> Proxies Sundog(sdk)._AWS, environment

Identity = {
  proxies
}

export default Identity
export {
  proxies
}
