export const DEFAULT_ARM_LENGTH = 100;
export const DEFAULT_INITIAL_ANGLE = Math.PI / 4;
export const DEFAULT_BOB_RADIUS = 20;
export const DEFAULT_BOB_COLOR = "black";

export class Pendulum {
    id: string;
    armLength: number;
    angle: number;
    bob: Bob;
    origin: Position;
    acceleration: number = 0
    velocity: number = 0

    constructor({
        id = generateId(),
        origin = { x: 0, y: 0 },
        armLength = DEFAULT_ARM_LENGTH,
        initialAngle = DEFAULT_INITIAL_ANGLE,
        bobRadius = DEFAULT_BOB_RADIUS,
        bobColor = DEFAULT_BOB_COLOR,
    }: CreatePendulumOptions = {}) {
        this.id = id;
        this.armLength = armLength;
        this.angle = initialAngle;

        this.origin = { ...origin }
        const { x, y } = this.getBobPosition();

        this.bob = {
            radius: bobRadius,
            color: bobColor,
            x,
            y,
        };
    }

    getBobPosition(): Position {
        return {
            x: this.armLength * Math.sin(this.angle) + this.origin.x,
            y: this.armLength * Math.cos(this.angle) + this.origin.y,
        }
    }

    setAngle(angle: number) {
        this.angle = angle;
        const { x, y } = this.getBobPosition();
        this.bob.x = x;
        this.bob.y = y;
    }

    move({ gravity = 9.81, time = 1 }) {
        this.acceleration = this.getAcceleration(gravity);
        this.velocity = this.getVelocity(gravity, time);

        const newAngle = this.getAngle(gravity, time);
        this.setAngle(newAngle);
    }

    private getAcceleration(gravity: number): number {
        return (-1 * this.getForce(gravity)) / this.armLength;
    }

    private getForce(gravity: number): number {
        return gravity * Math.sin(this.angle);
    }

    private getVelocity(gravity: number, time: number): number {
        const acceleration = this.getAcceleration(gravity);
        return this.velocity + acceleration * time;
    }

    private getAngle(gravity: number, time: number): number {
        const velocity = this.getVelocity(gravity, time);
        return this.angle + velocity * time;
    }
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

type Bob = ({
    radius: number;
    color: string;
} & Position);

type Position = {
    x: number;
    y: number;
}

export type CreatePendulumOptions = {
    id?: string;
    origin?: Position;
    armLength?: number;
    initialAngle?: number;
    bobRadius?: number;
    bobColor?: string;
}

