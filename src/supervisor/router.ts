import express from "express";

const router = express.Router()

router.get("/pendulums", (req, res) => {
    const supervisor = req.app.locals.supervisor
    res.send(supervisor.configs)
})

router.post("/startAll", (req, res) => {
    const supervisor = req.app.locals.supervisor

    // Publish start all event
    supervisor.broker.emit("startAll", { reason: "User requested" })

    res.status(202).send("Starting all pendulums")
})

router.post("/pauseAll", (req, res) => {
    const supervisor = req.app.locals.supervisor

    // Publish pause all event
    supervisor.broker.emit("pauseAll", { reason: "User requested" })

    res.status(202).send("Pausing all pendulums")
})

router.post("/stopAll", (req, res) => {
    const supervisor = req.app.locals.supervisor

    // Publish stop all event
    supervisor.broker.emit("stopAll", { reason: "User requested" })

    res.status(202).send("Stopping all pendulums")
})

export default router
