export const DEFAULT_ARM_LENGTH = 100;
export const DEFAULT_INITIAL_ANGLE = Math.PI / 4;
export const DEFAULT_MASS = 1;
export const DEFAULT_BOB_RADIUS = 20;
export const DEFAULT_BOB_COLOR = "black";

export class Pendulum {
  id: string;
  armLength: number;
  angle: number;
  mass: number;
  bob: Bob;
  origin: Position;
  acceleration: number = 0;
  velocity: number = 0;
  private initialConfig: CreatePendulumOptions;
  left?: string;
  right?: string

  constructor({
    id = generateId(),
    origin = { x: 0, y: 0 },
    armLength = DEFAULT_ARM_LENGTH,
    initialAngle = DEFAULT_INITIAL_ANGLE,
    mass = DEFAULT_MASS,
    bobRadius = DEFAULT_BOB_RADIUS,
    bobColor = DEFAULT_BOB_COLOR,
    left,
    right,
  }: CreatePendulumOptions = {}) {
    this.id = id;
    this.armLength = armLength;
    this.left = left;
    this.right = right;

    this.initialConfig = {
      id,
      origin,
      armLength,
      initialAngle,
      mass,
      bobRadius,
      bobColor,
    };

    this.angle = initialAngle;
    this.mass = mass;

    this.origin = { ...origin };
    const { x, y } = this.getBobPosition();

    this.bob = {
      radius: bobRadius,
      color: bobColor,
      x,
      y,
    };
  }

  getBobPosition(): Position {
    return getBobPosition(this);
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

  update(options: UpdatePendulumOptions) {
    this.mass = options.mass || this.mass;
    this.armLength = options.armLength || this.armLength;
    this.origin = options.origin || this.origin;
    this.angle = options.angle || this.angle;
    this.bob.radius = options.bobRadius || this.bob.radius;
    this.bob.color = options.bobColor || this.bob.color;
    this.left = options.left || this.left;
    this.right = options.right || this.right;

    this.resetMotionValues();

    const { x, y } = this.getBobPosition();
    this.bob.x = x;
    this.bob.y = y;

    return this;
  }

  private resetMotionValues() {
    this.acceleration = 0;
    this.velocity = 0;
  }

  resetPosition() {
    this.resetMotionValues();
    this.update({
      angle: this.initialConfig.initialAngle,
      origin: this.initialConfig.origin,
    });
  }

  private getAcceleration(gravity: number): number {
    return (-1 * this.getForce(gravity)) / this.armLength;
  }

  private getForce(gravity: number): number {
    return this.mass * gravity * Math.sin(this.angle);
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

export function getBobPosition(pendulum: Pendulum): Position {
  return {
    x: pendulum.armLength * Math.sin(pendulum.angle) + pendulum.origin.x,
    y: pendulum.armLength * Math.cos(pendulum.angle) + pendulum.origin.y,
  };
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

type Bob = {
  radius: number;
  color: string;
} & Position;

type Position = {
  x: number;
  y: number;
};

export type CreatePendulumOptions = {
  id?: string;
  origin?: Position;
  armLength?: number;
  initialAngle?: number;
  mass?: number;
  bobRadius?: number;
  bobColor?: string;
  left?: string;
  right?: string;
};

export type UpdatePendulumOptions = {
  mass?: number;
  armLength?: number;
  origin?: Position;
  angle?: number;
  bobRadius?: number;
  bobColor?: string;
  left?: string;
  right?: string;
};
