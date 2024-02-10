import { Broker } from "./base";
import { EventEmitter } from "events";

let singletonBroker: Broker | null = null

export function getDefaultBroker(): Broker {
    if (singletonBroker) {
        return singletonBroker
    }

    if (["test", "development"].includes(process.env.NODE_ENV || "")) {
        // return event emitter
        singletonBroker = new EventEmitter()
        return singletonBroker
    } else {
        // return mqtt
        throw new Error("Not implemented")
    }
}
