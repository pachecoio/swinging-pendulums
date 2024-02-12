import dotenv from 'dotenv';
import { pendulumsConfig } from "./config";
import { Supervisor } from './supervisor/supervisor';
import { getDefaultBroker } from './pendulum/adapters/broker';

dotenv.config();

getDefaultBroker().then((broker) => {
    console.log('Connected to broker for supervisor')
    const supervisor = new Supervisor(broker, pendulumsConfig);
    supervisor.start();
}).catch((err) => {
    console.log('Error starting supervisor', err)
})
