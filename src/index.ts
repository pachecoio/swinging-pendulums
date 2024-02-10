import { Worker } from "worker_threads";

const workers = []

    const worker = new Worker(
        './src/worker.js',
        {
            workerData: {
                path: './worker.ts',
                port: 3000,
                config: {
                    gravity: 1,
                    time: 1,
                    refreshRate: 1000,
                },
                pendulum: {},
            }
        },
    );
    workers.push(worker);

