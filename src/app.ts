import { Broker } from "./adapters/base";
import { getDefaultBroker } from "./adapters/broker";
import router from "./router";
import { Service } from "./service";
import express, { Express } from "express";

export class App {
    instance: Express
    private broker: Broker;
    private service: Service;

    constructor(broker: Broker = getDefaultBroker()) {
        this.instance = express()
        this.broker = broker;
        this.service = new Service(broker);

        this.instance.locals.service = this.service

        this.registerMiddlewares()
        this.registerRoutes()
    }

    private registerMiddlewares() {
        this.instance.use(express.json())
    }

    private registerRoutes() {
        this.instance.use(router)
    }
}
