import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { App } from "../app";
import request from "supertest";
import {
  DEFAULT_GRAVITY,
  DEFAULT_REFRESH_RATE,
  DEFAULT_TIME,
} from "../service";
import { EventEmitter } from "stream";
import { START_ALL, STOP_ALL } from "../../constants";

describe("App", () => {
  jest.useFakeTimers()
  const initialPort = process.env.PORT;
  const initialNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.PORT = "3000";
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    process.env.PORT = initialPort;
    process.env.NODE_ENV = initialNodeEnv;
  });

  it("should create an app instance with configuration from environment", () => {
    const app = new App(new EventEmitter());

    expect(app).toBeInstanceOf(App);
    // @ts-ignore
    expect(app.broker).toBeDefined();
    // @ts-ignore
    expect(app.service).toBeDefined();
  });

  it("should check health successfully", async () => {
    const app = new App(new EventEmitter());

    const res = await request(app.instance).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("should get service configuration", async () => {
    const app = new App(new EventEmitter());

    const res = await request(app.instance).get("/config");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      gravity: DEFAULT_GRAVITY,
      time: DEFAULT_TIME,
      refreshRate: DEFAULT_REFRESH_RATE,
    });
  });

  it("should get pendulum information", async () => {
    const app = new App(new EventEmitter());

    const res = await request(app.instance).get("/pendulum");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      armLength: expect.any(Number),
      origin: {
        x: expect.any(Number),
        y: expect.any(Number),
      },
      bob: {
        x: expect.any(Number),
        y: expect.any(Number),
        color: expect.any(String),
        radius: expect.any(Number),
      },
      acceleration: expect.any(Number),
      velocity: expect.any(Number),
      angle: expect.any(Number),
      mass: expect.any(Number),
      initialConfig: expect.any(Object)
    });
  });

  it("should update service configuration", async () => {
    const app = new App(new EventEmitter());

    const res = await request(app.instance)
      .put("/config")
      .send({ gravity: 5, time: 2, refreshRate: 100 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      gravity: 5,
      time: 2,
      refreshRate: 100,
    });
  });

  it("should update pendulum information", async () => {
    const app = new App(new EventEmitter());

    // @ts-ignore
    const initialBobX = app.service.getPendulum().bob.x;

    const res = await request(app.instance)
      .put("/pendulum")
      .send({
        mass: 2,
        origin: { x: 200, y: 0 },
        armLength: 100,
        angle: Math.PI / 4,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      armLength: 100,
      origin: {
        x: 200,
        y: 0,
      },
      bob: {
        x: expect.any(Number),
        y: expect.any(Number),
        color: expect.any(String),
        radius: expect.any(Number),
      },
      acceleration: expect.any(Number),
      velocity: expect.any(Number),
      angle: expect.any(Number),
      mass: 2,
      initialConfig: expect.any(Object)
    });

    expect(res.body.bob.x).not.toBe(initialBobX);
  });

  it("should start pendulum when supervisor emits startAll event", async () => {
    const broker = new EventEmitter();
    const app = new App(broker);

    let res = await request(app.instance).get("/pendulum");

    const initialBobX = res.body.bob.x;

    broker.emit(START_ALL);

    jest.advanceTimersByTime(1000);

    res = await request(app.instance).get("/pendulum");
    const newBobX = res.body.bob.x;
    expect(newBobX).not.toBe(initialBobX);

    broker.emit(STOP_ALL);

    jest.advanceTimersByTime(1000);
    expect(res.body.bob.x).toBe(newBobX);
  })
});
