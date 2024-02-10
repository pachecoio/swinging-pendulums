import { Broker } from "./adapters/base";
import { CreatePendulumOptions, Pendulum, UpdatePendulumOptions } from "./models/pendulum";
export const DEFAULT_GRAVITY = 9.81
export const DEFAULT_TIME = 1
export const DEFAULT_REFRESH_RATE = 1000

export class Service {
    private broker: Broker;
    private pendulum: Pendulum;
    private gravity: number;
    private time: number;
    private refreshRate: number;
    private swingingInterval: NodeJS.Timeout | null = null

    constructor(broker: Broker, options: ServiceOptions = {
        gravity: DEFAULT_GRAVITY,
        time: DEFAULT_TIME,
        refreshRate: 1000,
    }) {
        this.broker = broker
        this.gravity = options.gravity || DEFAULT_GRAVITY
        this.time = options.time || DEFAULT_TIME
        this.refreshRate = options.refreshRate || DEFAULT_REFRESH_RATE
        this.pendulum = new Pendulum(options)
    }

    movePendulum() {
        this.pendulum.move({
            gravity: this.gravity,
            time: this.time
        })
        this.broker.emit("moved", this.pendulum)
    }

    swingPendulum() {
        this.swingingInterval = setInterval(() => {
            this.movePendulum()
        }, this.refreshRate)
    }

    stopPendulum() {
        this.swingingInterval && clearInterval(this.swingingInterval)
        this.swingingInterval = null
        this.broker.emit("stopped", this.pendulum)
    }

    on(event: string, callback: Function): Service {
        this.broker.on(event, callback)
        return this
    }

    removeListener(event: string, callback: Function): Service {
        this.broker.removeListener(event, callback)
        return this
    }

    getConfig() {
        return {
            gravity: this.gravity,
            time: this.time,
            refreshRate: this.refreshRate,
        }
    }

    setConfig(options: ServiceOptions) {
        this.gravity = options.gravity || this.gravity
        this.time = options.time || this.time
        this.refreshRate = options.refreshRate || this.refreshRate
    }

    getPendulum() {
        return this.pendulum
    }

    updatePendulum(options: UpdatePendulumOptions) {
        this.pendulum.update(options)
        this.broker.emit("updated", this.pendulum)
    }
}

export type ServiceOptions = ({
    gravity?: number;
    time?: number;
    refreshRate?: number;
} & CreatePendulumOptions);


