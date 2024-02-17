const amqp = require('amqplib');

class AmqpWrapper {
  async connectToQueue(consumeCallback) {
    this.connection = await amqp.connect("amqp://localhost:5672");
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue('blockchain-queue');

    await this.channel.consume('blockchain-queue', data => {
      console.log('receive transaction')
      consumeCallback(JSON.parse(Buffer.from(data.content)));
      this.channel.ack(data);
    });
  }
}

module.exports = AmqpWrapper;