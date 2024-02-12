import { Request } from "express"
import { Service } from "./service"
import { Pendulum } from "./models/pendulum"
import { getMovedEventName } from "./utils/eventUtils"

const handler = (ws: any, req: Request) => {
    const service = req.app.locals.service as Service

    const handler = (pendulum: Pendulum) => {
        ws.send(JSON.stringify(pendulum))
    }

    const movedEventName = getMovedEventName(service.pendulum.id)
    service.on(movedEventName, handler)

    ws.on("close", () => {
        service.removeListener(movedEventName, handler)
    })
}

export default handler
