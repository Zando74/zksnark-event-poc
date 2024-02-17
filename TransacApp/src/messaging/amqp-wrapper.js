const amqp = require('amqplib');

class AmqpWrapper {
  async connectToQueue() {
    this.connection = await amqp.connect("amqp://localhost:5672");
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue('transactions-queue');
  }

  async send(data) {
    this.channel.sendToQueue('transactions-queue', Buffer.from(JSON.stringify(data)));
  }
}

module.exports = AmqpWrapper;