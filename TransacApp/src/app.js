const EventEmitterSimulator = require("./events/event-emitter-simulator");
const amqp = require('amqplib');
const AmqpWrapper = require("./messaging/amqp-wrapper");

class App {
  constructor() {
    this.eventEmitterSimulator = new EventEmitterSimulator();
    this.amqpWrapper = new AmqpWrapper();
  }

  async start() {
    await this.amqpWrapper.connectToQueue();
    this.eventEmitterSimulator.startEmitEvents(this.processEvents);
  }

  processEvents = async (event) => {
    console.log('évènement émit : \n', event);
    this.amqpWrapper.send(event);

  }
}

module.exports = App;