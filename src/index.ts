import { Worker } from "worker_threads";
import dotenv from 'dotenv';

dotenv.config();

const config = {
    gravity: process.env.DEFAULT_GRAVITY || 1,
    time: process.env.DEFAULT_TIME || 1,
    refreshRate: process.env.DEFAULT_REFRESH_RATE || 1000,
}

const workers = []

const configs = [
    {
        path: './worker.ts',
        port: 3000,
        config,
        pendulum: {
            origin: {
                x: 100,
                y: 0,
            },
            initialAngle: Math.PI / 4,
        },
    },
    {
        path: './worker.ts',
        port: 3001,
        config,
        pendulum: {
            origin: {
                x: 200,
                y: 0,
            },
            initialAngle: Math.PI / 2,
        },
    },
    {
        path: './worker.ts',
        port: 3002,
        config,
        pendulum: {
            origin: {
                x: 300,
                y: 0,
            },
            initialAngle: Math.PI / 3,
        },
    },
    {
        path: './worker.ts',
        port: 3003,
        config,
        pendulum: {
            origin: {
                x: 400,
                y: 0,
            },
            initialAngle: Math.PI / 6,
        },
    },
    {
        path: './worker.ts',
        port: 3004,
        config,
        pendulum: {
            origin: {
                x: 500,
                y: 0,
            },
            initialAngle: Math.PI / 8,
        },
    },
]

configs.forEach((config) => {
    workers.push(createWorker(config))
})

function createWorker({
    path = './worker.ts',
    port,
    config,
    pendulum,
}: CreateWorkerOptions) {
    const worker = new Worker(
        './src/worker.js',
        {
            workerData: {
                path,
                port,
                config,
                pendulum,
            }
        },
    );
    return worker;
}

type CreateWorkerOptions = {
    path: string;
    port: number;
    config: any;
    pendulum: any;
}

