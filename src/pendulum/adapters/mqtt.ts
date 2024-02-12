import { connect, MqttClient } from 'mqtt';
import { Broker } from './base';

export class MQTTBroker implements Broker {
  private client: MqttClient;
  private handlers: Map<string, Function[]> = new Map();

  constructor(client: MqttClient) {
    this.client = client;
    this.registerMessageHandler();
  }

  static async init(clientId: string = 'pendulum-service') {
    const uri = process.env.MQTT_BROKER_URI || 'mqtt://localhost:1883';

    const client = await new Promise<MqttClient>((resolve, reject) => {
      const client = connect(uri)

      client.on('connect', () => {
        resolve(client);
      });

      client.on('error', (err) => {
        console.log('Error connecting to MQTT broker', err);
        reject(err);
      });

    })

    return new MQTTBroker(client);
  }

  private registerMessageHandler() {
    this.client.on('message', (topic: string, payload: any) => {
      const handlers = this.handlers.get(topic) || [];
      handlers.forEach((handler) => {
        try {
          return handler(JSON.parse(payload.toString()));
        } catch (err) {
          console.log('Error parsing payload', err);
        }
        handler(payload);
      });
    })
  }

  on(topic: string, callback: Function) {
    const handlers = this.handlers.get(topic) || [];
    this.handlers.set(topic, [...handlers, callback]);

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.log('Error subscribing to topic', topic, err);
      }
    })

    return this;
  }

  emit(topic: string, payload: any) {
    console.log('Emitting message', topic, payload)
    this.client.publish(topic, JSON.stringify(payload), { qos: 1, retain: false });
  }

  removeListener(event: string, callback: Function) {
    const handlers = this.handlers.get(event) || [];
    this.handlers.set(event, handlers.filter((handler) => handler !== callback));
  }

  end() {
    this.client.end();
  }
}

