import express, { Express } from "express"
import { Broker } from "../pendulum/adapters/base";
import router from "./router";
import { Worker } from "worker_threads";
import { createWorker } from "../worker/utils";
import { getStartEventName } from "../pendulum/utils/eventUtils";

export class Supervisor {
    instance: Express
    broker: Broker;
    configs: PendulumConfig[]
    private workers: Worker[] = []
    private runningPendulums: Set<string> = new Set()

    constructor(broker: Broker, configs: PendulumConfig[]) {
        this.instance = express()
        this.broker = broker;
        this.configs = configs
        this.instance.locals.supervisor = this

        this.registerMiddlewares()
        this.registerRoutes()
    }

    private registerMiddlewares() {
        this.instance.use(express.json())
    }

    private registerRoutes() {
        this.instance.use(router)
    }

    start() {
        console.log('Starting supervisor')

        this.configs.forEach((config) => {
            this.workers.push(
                createWorker(config)
            )
            const pendulumStartedEventName = getStartEventName(config.pendulum.id)

            this.broker.on(pendulumStartedEventName, () => {
                console.log('Pendulum started', config.pendulum.id)
                this.runningPendulums.add(config.pendulum.id)
            })
        })

        this.instance.listen(3000, () => {
            console.log("Server started on port 3000");
        })
    }
}

type PendulumConfig = {
    path: string;
    port: number;
    config: any;
    pendulum: any;
}
