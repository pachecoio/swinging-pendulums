import { workerData } from "worker_threads"
import { runServer } from "./server"

console.log('Worker started')

runServer(workerData)
