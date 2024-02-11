import { describe, expect, it, jest } from "@jest/globals";
import { Pendulum } from "../models/pendulum";
import { EventEmitter } from "events";
import { DEFAULT_GRAVITY, DEFAULT_TIME, Service } from "../service";
import { Broker } from "../adapters/base";
import { MQTTBroker } from "../adapters/mqtt";

describe("Test pendulum service", () => {
  jest.useFakeTimers();

  it("should create a service instance", () => {
    const broker = jest.fn() as unknown as Broker;
    const service = new Service(broker);
    expect(service).toBeInstanceOf(Service);
    // @ts-ignore
    expect(service.pendulum).toBeInstanceOf(Pendulum);
    // @ts-ignore
    expect(service.gravity).toBe(DEFAULT_GRAVITY);
    // @ts-ignore
    expect(service.time).toBe(DEFAULT_TIME);
  });

  it("should move the pendulum and trigger event", () => {
    const moveHandler = jest.fn();
    const stopHandler = jest.fn();

    const broker = new EventEmitter();
    const service = new Service(broker);

    service.on("moved", moveHandler).on("stopped", stopHandler);

    service.movePendulum();
    expect(moveHandler).toBeCalledTimes(1);
    expect(stopHandler).toBeCalledTimes(0);
  });

  it("should remove event listener", () => {
    const moveHandler = jest.fn();
    const stopHandler = jest.fn();

    const broker = new EventEmitter();
    const service = new Service(broker)
      .on("moved", moveHandler)
      .on("stopped", stopHandler);

    service.removeListener("moved", moveHandler);
    service.movePendulum();
    expect(moveHandler).toBeCalledTimes(0);
    expect(stopHandler).toBeCalledTimes(0);
  });

  it("should swing the pendulum and trigger event", () => {
    const moveHandler = jest.fn();
    const stopHandler = jest.fn();

    const broker = new EventEmitter();
    const service = new Service(broker, { refreshRate: 100 })
      .on("moved", moveHandler)
      .on("stopped", stopHandler);

    service.swingPendulum();
    expect(moveHandler).toBeCalledTimes(0);
    expect(stopHandler).toBeCalledTimes(0);

    jest.advanceTimersByTime(2000);
    expect(moveHandler).toBeCalledTimes(20);
    expect(stopHandler).toBeCalledTimes(0);

    service.stopPendulum();
    expect(stopHandler).toBeCalledTimes(1);

    // @ts-ignore
    expect(service.swingingInterval).toBeNull();
  });
});

