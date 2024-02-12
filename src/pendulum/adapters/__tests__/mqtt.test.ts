import { describe } from "@jest/globals";
import mqtt from "mqtt";
import { MQTTBroker } from "../mqtt";

// Integration test requires mqtt running
describe.skip("Test mqtt integration", () => {

  const connect = async (uri: string, options: any) => {
    return new Promise((resolve, reject) => {
      const client = mqtt.connect(uri, options);

      client.on('connect', () => {
        resolve(client);
      });

      client.on('error', (err) => {
        console.log('Error connecting to MQTT broker', err);
        reject(err);
      });
    })
  }

  it("should connect to MQTT broker", async () => {

    const client = await connect('mqtt://localhost:1883', {
      clientId: 'pendulum-service',
      clean: true,
    });

    expect(client).toBeDefined();

    // @ts-ignore
    client.end();
  })

  it("should subscribe to an event and receive message", async () => {
    const client: any = await connect('mqtt://localhost:1883', {
      clientId: 'pendulum-service',
      clean: true,
    });

    const topic = 'test-topic';
    const message = 'test-message';

    const handlers = new Map<string, Function[]>();
    const handler = jest.fn();
    handlers.set(topic, [handler])

    client.subscribe(topic, (err: any) => {
      if (err) {
        console.log('Error subscribing to topic', err);
      }
    })

    client.on('message', (topic: string, payload: any) => {
      const _handlers = handlers.get(topic) || [];
      _handlers.forEach((handler) => {
        handler(payload);
      });
    })

    client.publish(topic, message);
    await sleep(100);
    expect(handler).toHaveBeenCalledTimes(1);
    // @ts-ignore
    client.end();
  })

  it("should instanciate custom MqttBroker", async () => {
    const broker = await MQTTBroker.init()
    expect(broker).toBeDefined();

    broker.end();
  })

  it("should subscribe a new handler", async () => {
    const client = await MQTTBroker.init()
    const topic = 'test-topic';

    const handler = jest.fn();

    client.on(topic, handler);
    client.emit(topic, 'test-message');

    await sleep(100);
    expect(handler).toHaveBeenCalledTimes(1);

    client.end();
  })

  it("should subscribe a handler and treat payload", async () => {
    const client = await MQTTBroker.init()
    const topic = 'test-topic';

    const handler = jest.fn();

    client.on(topic, handler);
    client.emit(topic, { message: 'test-message' });

    await sleep(100);
    expect(handler).toHaveBeenCalledWith({ message: 'test-message' });

    client.end();
  })

  it('should create two brokers and communicate', async () => {
    const broker1 = await MQTTBroker.init();
    const broker2 = await MQTTBroker.init();

    const topic = 'test-topic';
    const handler = jest.fn();

    broker2.on(topic, handler);
    broker1.emit(topic, 'test-message');

    await sleep(500);

    expect(handler).toHaveBeenCalledTimes(1);

    broker1.end();
    broker2.end();
  })
})

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}
