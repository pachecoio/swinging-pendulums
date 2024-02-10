import { Broker } from "./base";
import { EventEmitter } from "events";

let singletonBroker: Broker | null = null

export function getDefaultBroker(): Broker {
    if (singletonBroker) {
        return singletonBroker
    }

    if (["test"].includes(process.env.NODE_ENV || "")) {
        // return event emitter
        singletonBroker = new EventEmitter()
    } else {
        // return mqtt
        singletonBroker = new EventEmitter()
    }

    return singletonBroker
}
