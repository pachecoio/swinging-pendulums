export function getMovedEventName(pendulumId: string) {
    return `moved:${pendulumId}`;
}

export function getStoppedEventName(pendulumId: string) {
    return `stopped:${pendulumId}`;
}

export function getResetEventName(pendulumId: string) {
    return `reset:${pendulumId}`;
}

export function getStartedEventName(pendulumId: string) {
    return `started:${pendulumId}`;
}

export function getPausedEventName(pendulumId: string) {
    return `paused:${pendulumId}`;
}

export function getUpdatedEventName(pendulumId: string) {
    return `updated:${pendulumId}`;
}

export function getStartCommandName(pendulumId: string) {
    return `start:${pendulumId}`;
}

export function getStopCommandName(pendulumId: string) {
    return `stop:${pendulumId}`;
}
