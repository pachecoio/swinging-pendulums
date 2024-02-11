import { Broker } from "./base";
import { EventEmitter } from "events";
import { MQTTBroker } from "./mqtt";

let singletonBroker: Broker | null = null;

export async function getDefaultBroker(): Promise<Broker> {
  if (["test"].includes(process.env.NODE_ENV || "")) {
    // return event emitter
    singletonBroker = new EventEmitter();
  } else {
    // return mqtt
    console.log('initialize mqtt')
    singletonBroker = await MQTTBroker.init();
  }

  return singletonBroker;
}
