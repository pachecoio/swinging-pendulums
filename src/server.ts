import { App } from "./app"

export function runServer(options: ServerOptions) {
    const app = new App()
    const port = options.port || 3000

    app.instance.listen(port, () => {
        app.service.setConfig(options.config)
        app.service.updatePendulum(options.pendulum)

        app.service.swingPendulum()
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
