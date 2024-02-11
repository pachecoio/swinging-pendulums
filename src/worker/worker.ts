import { workerData } from "worker_threads"
import { runServer } from "../pendulum/server"

console.log('Worker started')

runServer(workerData)
