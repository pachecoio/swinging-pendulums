const serverConfig = {
    gravity: process.env.DEFAULT_GRAVITY || 1,
    time: process.env.DEFAULT_TIME || 1,
    refreshRate: process.env.DEFAULT_REFRESH_RATE || 100,
}

export const pendulumsConfig = [
    {
        path: './worker.ts',
        port: 3001,
        config: serverConfig,
        pendulum: {
            id: '1',
            right: '2',
            origin: {
                x: 100,
                y: 0,
            },
            initialAngle: Math.PI / 4,
            armLength: 100,
            bobColor: 'red',
            bobRadius: 30,
        },
    },
    {
        path: './worker.ts',
        port: 3002,
        config: serverConfig,
        pendulum: {
            id: '2',
            left: '1',
            right: '3',
            origin: {
                x: 200,
                y: 0,
            },
            armLength: 200,
            initialAngle: Math.PI / 2,
            bobColor: 'blue',
            bobRadius: 20,
        },
    },
    {
        path: './worker.ts',
        port: 3003,
        config: serverConfig,
        pendulum: {
            id: '3',
            left: '2',
            right: '4',
            origin: {
                x: 400,
                y: 0,
            },
            armLength: 150,
            initialAngle: Math.PI / 3,
            bobColor: 'green',
            bobRadius: 50,
        },
    },
    {
        path: './worker.ts',
        port: 3004,
        config: serverConfig,
        pendulum: {
            id: '4',
            left: '3',
            right: '5',
            origin: {
                x: 600,
                y: 0,
            },
            armLength: 200,
            initialAngle: Math.PI / 6,
            bobColor: 'yellow',
            bobRadius: 40,
        },
    },
    {
        path: './worker.ts',
        port: 3005,
        config: serverConfig,
        pendulum: {
            id: '5',
            left: '4',
            origin: {
                x: 700,
                y: 0,
            },
            armLength: 100,
            initialAngle: Math.PI / 4,
            bobColor: 'purple',
            bobRadius: 60,
        },
    },
]
