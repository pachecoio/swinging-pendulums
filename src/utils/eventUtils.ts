export function getMoveEventName(pendulumId: string) {
    return `move:${pendulumId}`;
}

export function getStoppedEventName(pendulumId: string) {
    return `stop:${pendulumId}`;
}

export function getResetEventName(pendulumId: string) {
    return `reset:${pendulumId}`;
}

export function getStartEventName(pendulumId: string) {
    return `start:${pendulumId}`;
}

export function getPauseEventName(pendulumId: string) {
    return `pause:${pendulumId}`;
}

export function getUpdateEventName(pendulumId: string) {
    return `update:${pendulumId}`;
}
