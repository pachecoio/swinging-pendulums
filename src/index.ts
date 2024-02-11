import dotenv from 'dotenv';
import { pendulumsConfig } from "./config";
import { createWorker } from "./worker/utils";

dotenv.config();

const workers = []

pendulumsConfig.forEach((config) => {
    workers.push(createWorker(config))
})

