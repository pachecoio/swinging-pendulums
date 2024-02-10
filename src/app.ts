import { Broker } from "./adapters/base";
import { getDefaultBroker } from "./adapters/broker";
import router from "./router";
import { Service } from "./service";
import express, { Express } from "express";
import expressWs from "express-ws";
import websocketHandler from "./websocketHandler";

export class App {
    instance: Express
    service: Service;
    private broker: Broker;

    constructor(broker: Broker = getDefaultBroker(), service?: Service) {
        this.instance = express()
        this.broker = broker;
        this.service = service || new Service(broker);

        this.instance.locals.service = this.service

        this.registerMiddlewares()

        this.registerRoutes()
        this.registerWebsockets()
    }

    private registerMiddlewares() {
        this.instance.use(express.json())
        expressWs(this.instance)
    }

    private registerRoutes() {
        this.instance.use(router)
    }

    private registerWebsockets() {
        // @ts-ignore
        this.instance.ws("/pendulum", websocketHandler)
    }
}
