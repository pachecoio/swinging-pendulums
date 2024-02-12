# Simple Pendulum Backend Service Documentation

This document outlines the architecture and REST API of a backend service designed to simulate and control multiple instances of a simple pendulum. This service facilitates interaction with individual pendulum simulations, allowing for configuration, control, and monitoring through a REST interface. It also details communication with a UI for visualization and interaction.

## System Architecture

The system is divided into two main modules: the Pendulum module and the Supervisor module. Each module plays a specific role in managing pendulum simulations and their interactions.

### Pendulum Module

The Pendulum module is responsible for simulating the behavior of a simple pendulum. Each instance of this module represents a single pendulum simulation, running on its own Node.js process, allowing for parallel execution of multiple pendulum simulations. These instances can be configured and controlled independently.

#### Features:

- **Discovery**: List the configuration of pendulums running along with their ports
- **Configuration**: Set initial parameters like angular offset, mass, and string length.
- **Simulation Control**: Start, pause, and stop the pendulum's motion.
- **State Monitoring**: Retrieve the latest coordinates of the pendulum for visualization.

### Supervisor Module

The Supervisor module oversees the operation of multiple Pendulum module instances, controlling their execution and facilitating communication between them.

#### Features:

- **Instance Management**: Launch and manage multiple pendulum instances (each running on its own TCP port).
- **Global Configuration**: Set and modify global parameters such as gravity, time and refreshRate.
- **Neighbor Awareness**: Configure each pendulum instance with information about its immediate neighbors for proximity monitoring.

## REST API Documentation

### Pendulum Module API

Refer to the openapi documentation under `src/pendulum/pendulum.openapi.yaml`.

### Supervisor Module API

Refer to the openapi documentation under `src/supervisor/supervisor.openapi.yaml`.

### MQTT Communication for Emergency Stop

In case pendulums come too close to each other, an MQTT message with topic `PAUSE` is sent to all instances. Each instance will stop  with a `STOP` event after a 5-second delay, send a `START` message and restart. Once all instances have sent and acknowledged the restart message, they will resume movement.

## UI Interaction

The UI interacts with the backend service through the REST API for configuration and control of pendulum instances. It periodically polls the state of each pendulum for visualization.
