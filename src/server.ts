import { App } from "./app"

export function runServer(workerData: WorkerData) {
    const app = new App()
    const port = workerData.port || 3000

    app.instance.listen(port, () => {
        app.service.setConfig(workerData.config)
        app.service.updatePendulum(workerData.pendulum)

        app.service.swingPendulum()
        console.log(`Server is running on port ${port}`)

        process.on("SIGINT", () => {
            app.service.stopPendulum()
            process.exit()
        })
    })
}

export type WorkerData = {
    path: string;
    port: number;
    config: any;
    pendulum: any;
}
