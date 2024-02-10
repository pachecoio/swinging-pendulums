import { Request } from "express"
import { Service } from "./service"
import { Pendulum } from "./models/pendulum"

const handler = (ws: any, req: Request) => {
    const service = req.app.locals.service as Service

    const handler = (pendulum: Pendulum) => {
        ws.send(JSON.stringify(pendulum))
    }

    service.on("moved", handler)

    ws.on("close", () => {
        service.removeListener("moved", handler)
    })
}

export default handler
