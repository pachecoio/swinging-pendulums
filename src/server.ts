import { getDefaultBroker } from "./adapters/broker"
import { App } from "./app"
import { Service } from "./service"

export function runServer(options: ServerOptions) {
    const broker = getDefaultBroker()
    const service = new Service(
        broker,
        {
            ...options.config,
            ...options.pendulum
        }
    )
    const app = new App(broker, service)
    const port = options.port || 3000

    app.instance.listen(port, () => {
        app.service.setConfig(options.config)
        app.service.updatePendulum(options.pendulum)

        console.log(`Server is running on port ${port}`)

        process.on("SIGINT", () => {
            app.service.stopPendulum()
            process.exit()
        })
    })
}

export type ServerOptions = {
    path: string;
    port: number;
    config: any;
    pendulum: any;
}
