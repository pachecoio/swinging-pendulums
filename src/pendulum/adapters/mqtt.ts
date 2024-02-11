import { connect, MqttClient } from 'mqtt';
import { Broker } from './base';

export class MQTTBroker implements Broker {
  private client: MqttClient;

  constructor(client: MqttClient) {
    this.client = client;
  }

  static async init() {
    const uri = process.env.MQTT_BROKER_URI || 'mqtt://localhost:1883';

    console.log('connecting to mqtt broker', uri)

    const client = connect(uri, {
      clientId: 'pendulum-service',
      clean: true,
    })

    return new Promise<MqttClient>((resolve, reject) => {
      client.on('connect', () => {
        resolve(client)
      })

      client.on('error', (err) => {
        console.error('error connecting to mqtt broker', err)
        reject(err)
      })
    })
  }

  on(event: string, callback: Function) {
    this.client.subscribe(event, callback as any);
  }

  emit(event: string, payload: any) {
    this.client.publish(event, JSON.stringify(payload), { qos: 1, retain: false });
  }

  removeListener(event: string, callback: Function) {
    this.client.unsubscribe(event, callback as any);
  }
}

