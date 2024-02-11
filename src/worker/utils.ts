import { Worker } from "worker_threads";

export function createWorker({
    path = './worker.ts',
    port,
    config,
    pendulum,
}: CreateWorkerOptions) {
    const worker = new Worker(
        './src/worker/worker.js',
        {
            // @ts-ignore
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

