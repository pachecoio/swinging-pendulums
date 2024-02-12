import express from "express";
import { COLLISION_DETECTED, PAUSE_ALL, START_ALL, STOP_ALL, UPDATE_SETTINGS } from "../constants";

const router = express.Router()

router.get("/pendulums", (req, res) => {
    const supervisor = req.app.locals.supervisor
    res.send(supervisor.configs)
})

router.post("/startAll", (req, res) => {
    const supervisor = req.app.locals.supervisor

    // Publish start all event
    supervisor.broker.emit(START_ALL, { reason: "User requested" })

    res.status(202).send("Starting all pendulums")
})

router.post("/pauseAll", (req, res) => {
    const supervisor = req.app.locals.supervisor

    // Publish pause all event
    supervisor.broker.emit(PAUSE_ALL, { reason: "User requested" })

    res.status(202).send("Pausing all pendulums")
})

router.post("/stopAll", (req, res) => {
    const supervisor = req.app.locals.supervisor

    // Publish stop all event
    supervisor.broker.emit(STOP_ALL, { reason: "User requested" })

    res.status(202).send("Stopping all pendulums")
})

router.put("/settings", (req, res) => {
    const supervisor = req.app.locals.supervisor
    const { gravity, time, refreshRate } = req.body

    // Update settings
    supervisor.broker.emit(UPDATE_SETTINGS, { gravity, time, refreshRate })

    res.status(200).send("Requested settings change")
})

router.get("/events", (req, res, next) => {
    const supervisor = req.app.locals.supervisor

    const headers = {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
    }

    res.writeHead(200, headers)

    supervisor.broker.on(COLLISION_DETECTED, () => {
        res.write(`data: ${COLLISION_DETECTED}\n\n`)
    })

    supervisor.broker.on(START_ALL, () => {
        res.write(`data: ${START_ALL}\n\n`)
    })

    supervisor.broker.on(PAUSE_ALL, () => {
        res.write(`data: ${PAUSE_ALL}\n\n`)
    })

    supervisor.broker.on(STOP_ALL, () => {
        res.write(`data: ${STOP_ALL}\n\n`)
    })

    res.write("data: Connected\n\n")

    req.on("close", () => {
        res.end()
    })
})

export default router
