export {}

import {ContextBridgeApi} from "../mainPreload";


declare global {
    interface Window {
        api: ContextBridgeApi
    }
}