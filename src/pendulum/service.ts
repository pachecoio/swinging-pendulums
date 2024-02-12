import { Broker } from "./adapters/base";
import { CreatePendulumOptions, Pendulum, UpdatePendulumOptions } from "./models/pendulum";
import { getMovedEventName, getResetEventName, getStartCommandName, getStartedEventName, getStoppedEventName, getUpdatedEventName } from "./utils/eventUtils";
export const DEFAULT_GRAVITY = 1
export const DEFAULT_TIME = 1
export const DEFAULT_REFRESH_RATE = 100

export class Service {
    private broker: Broker;
    pendulum: Pendulum;
    private gravity: number;
    private time: number;
    private refreshRate: number;
    private swingingInterval: NodeJS.Timeout | null = null

    constructor(broker: Broker, options: ServiceOptions = {
        gravity: DEFAULT_GRAVITY,
        time: DEFAULT_TIME,
        refreshRate: DEFAULT_REFRESH_RATE,
    }) {
        this.broker = broker
        this.gravity = options.gravity || DEFAULT_GRAVITY
        this.time = options.time || DEFAULT_TIME
        this.refreshRate = options.refreshRate || DEFAULT_REFRESH_RATE
        this.pendulum = new Pendulum(options)

        this.registerSupervisorEvents()
        this.registerPendulumCommands()
    }

    private registerSupervisorEvents() {
        console.log('subscribing to supervisor events')
        this.broker.on("startAll", () => {
            this.swingPendulum()
        })

        this.broker.on("stopAll", () => {
            this.stopPendulum()
        })
    }

    private registerPendulumCommands() {
        const startCommand = getStartCommandName(this.pendulum.id)
        this.broker.on(startCommand, () => {
            this.swingPendulum()
        })

        const stopCommand = getStartCommandName(this.pendulum.id)
        this.broker.on(stopCommand, () => {
            this.stopPendulum()
        })
    }

    movePendulum() {
        this.pendulum.move({
            gravity: this.gravity,
            time: this.time
        })
        const eventName = getMovedEventName(this.pendulum.id)
        this.broker.emit(eventName, this.pendulum)
    }

    swingPendulum() {
        this.swingingInterval = setInterval(() => {
            this.movePendulum()
        }, this.refreshRate)

        const eventName = getStartedEventName(this.pendulum.id)
        this.broker.emit(eventName, this.pendulum)
    }

    stopPendulum() {
        this.swingingInterval && clearInterval(this.swingingInterval)
        this.swingingInterval = null
        const eventName = getStoppedEventName(this.pendulum.id)
        this.broker.emit(eventName, this.pendulum)
    }

    resetPendulum() {
        this.pendulum.resetPosition()
        const eventName = getResetEventName(this.pendulum.id)
        this.broker.emit(eventName, this.pendulum)
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

        if (this.isSwinging()) {
            this.stopPendulum()
            this.swingPendulum()
        }
    }

    isSwinging() {
        return !!this.swingingInterval
    }

    getPendulum() {
        return this.pendulum
    }

    updatePendulum(options: UpdatePendulumOptions) {
        this.pendulum.update(options)
        const eventName = getUpdatedEventName(this.pendulum.id)
        this.broker.emit(eventName, this.pendulum)
    }
}

export type ServiceOptions = ({
    gravity?: number;
    time?: number;
    refreshRate?: number;
} & CreatePendulumOptions);


