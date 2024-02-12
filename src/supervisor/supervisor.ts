import express, { Express } from "express"
import { Broker } from "../pendulum/adapters/base";
import router from "./router";
import { Worker } from "worker_threads";
import { createWorker } from "../worker/utils";
import { getMovedEventName, getStartedEventName } from "../pendulum/utils/eventUtils";
import { Pendulum, getBobPosition } from "../pendulum/models/pendulum";
import cors from "cors";
import { COLLISION_DETECTED, PAUSE_ALL, START_ALL, STOP_ALL } from "../constants";

const DEFAULT_COLLISION_THRESHOLD = 50

export class Supervisor {
    instance: Express
    broker: Broker;
    configs: PendulumConfig[]
    private workers: Worker[] = []
    private pendulums: Map<string, Pendulum> = new Map()

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
        this.instance.use(cors())
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
            this.registerPendulumEvents(config.pendulum.id)
        })

        this.registerCollisionEvent()

        this.instance.listen(3000, () => {
            console.log("Server started on port 3000");
        })
    }

    private registerPendulumEvents(pendulumId: string) {
        const pendulumStartedEventName = getStartedEventName(pendulumId)

        this.broker.on(pendulumStartedEventName, (pendulum: Pendulum) => {
            this.pendulums.set(pendulumId, pendulum)
        })

        const pendulumMovedEventName = getMovedEventName(pendulumId)

        this.broker.on(pendulumMovedEventName, (pendulum: Pendulum) => {
            this.pendulums.set(pendulumId, pendulum)
            this.detectCollision(pendulum)
        })
    }

    private registerCollisionEvent() {
        this.broker.on(PAUSE_ALL, ({ reason }: { reason: string }) => {
            if (reason === 'Collision detected') {
                console.log('Collision detected, restargin penduluns in 5 seconds')
                const timeout = setTimeout(() => {
                    this.broker.emit(STOP_ALL, { reason: 'Collision detected' })
                    this.broker.emit(START_ALL, { reason: 'Collision detected' })
                }, 5000)

                const cancelTimeout = () => clearTimeout(timeout)
                this.broker.on(START_ALL, cancelTimeout)
                this.broker.on(STOP_ALL, cancelTimeout)
                this.broker.on(PAUSE_ALL, cancelTimeout)
            }
        })
    }

    private detectCollision(pendulum: Pendulum) {
        if (this.hasLeftCollision(pendulum) || this.hasRightCollision(pendulum)) {
            console.log('collision detected')
            this.broker.emit(COLLISION_DETECTED, pendulum.id)
            this.broker.emit(PAUSE_ALL, { reason: 'Collision detected' })
        }
    }

    private hasLeftCollision(pendulum: Pendulum) {
        const leftPendulum = pendulum.left ? this.pendulums.get(pendulum.left) : null
        if (!leftPendulum) return false

        const pos1 = getBobPosition(leftPendulum)
        const pos2 = getBobPosition(pendulum)

        return this.isTooClose(pos1, pos2)

    }

    private hasRightCollision(pendulum: Pendulum) {
        const rightPendulum = pendulum.right ? this.pendulums.get(pendulum.right) : null
        if (!rightPendulum) return false

        const pos1 = getBobPosition(pendulum)
        const pos2 = getBobPosition(rightPendulum)

        return this.isTooClose(pos1, pos2)
    }

    // Detect if position 1 is too close to position 2
    // If the distance between the two positions is less than the threshold
    private isTooClose(position1: Position, position2: Position) {
        const distance = Math.sqrt(
            Math.pow(position2.x - position1.x, 2) +
            Math.pow(position2.y - position1.y, 2)
        )

        return distance < DEFAULT_COLLISION_THRESHOLD
    }
}

type PendulumConfig = {
    path: string;
    port: number;
    config: any;
    pendulum: any;
}

type Position = {
    x: number;
    y: number;
};

