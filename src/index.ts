import { App } from "./app"

const app = new App()
const port = process.env.PORT || 3000

app.instance.listen(port, () => {
    app.service.swingPendulum()
    console.log(`Server is running on port ${port}`)

    process.on("SIGINT", () => {
        app.service.stopPendulum()
        process.exit()
    })
})
