const serverConfig = {
    gravity: process.env.DEFAULT_GRAVITY || 1,
    time: process.env.DEFAULT_TIME || 1,
    refreshRate: process.env.DEFAULT_REFRESH_RATE || 1000,
}

export const pendulumsConfig = [
    {
        path: './worker.ts',
        port: 3001,
        config: serverConfig,
        pendulum: {
            id: '1',
            origin: {
                x: 100,
                y: 0,
            },
            initialAngle: Math.PI / 4,
        },
    },
    {
        path: './worker.ts',
        port: 3002,
        config: serverConfig,
        pendulum: {
            id: '2',
            origin: {
                x: 200,
                y: 0,
            },
            initialAngle: Math.PI / 2,
        },
    },
    {
        path: './worker.ts',
        port: 3003,
        config: serverConfig,
        pendulum: {
            id: '3',
            origin: {
                x: 300,
                y: 0,
            },
            initialAngle: Math.PI / 3,
        },
    },
    {
        path: './worker.ts',
        port: 3004,
        config: serverConfig,
        pendulum: {
            id: '4',
            origin: {
                x: 400,
                y: 0,
            },
            initialAngle: Math.PI / 6,
        },
    },
    {
        path: './worker.ts',
        port: 3005,
        config: serverConfig,
        pendulum: {
            id: '5',
            origin: {
                x: 500,
                y: 0,
            },
            initialAngle: Math.PI / 8,
        },
    },
]
