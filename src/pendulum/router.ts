import { Router } from "express";
import { Service } from "./service";

const router = Router()

router.get("/health", (_, res) => {
    res.json({ status: "ok" })
})

router.get("/config", (req, res) => {
    const service = req.app.locals.service as Service

    res.json(service.getConfig())
})

router.put("/config", (req, res) => {
    const service = req.app.locals.service as Service
    const { gravity, time, refreshRate } = req.body

    service.setConfig({ gravity, time, refreshRate })

    res.json(service.getConfig())
})

router.get("/pendulum", (req, res) => {
    const service = req.app.locals.service as Service
    res.json(service.getPendulum())
})

router.put("/pendulum", (req, res) => {
    const service = req.app.locals.service as Service

    service.updatePendulum(req.body)
    res.json(service.getPendulum())
})

router.post("/pendulum/start", (req, res) => {
    const service = req.app.locals.service as Service
    service.swingPendulum()
    res.json(service.getPendulum())
})

router.post("/pendulum/pause", (req, res) => {
    const service = req.app.locals.service as Service
    service.stopPendulum()
    res.json(service.getPendulum())
})

router.post("/pendulum/stop", (req, res) => {
    const service = req.app.locals.service as Service
    service.stopPendulum()
    service.resetPendulum()
    res.json(service.getPendulum())
})


export default router
