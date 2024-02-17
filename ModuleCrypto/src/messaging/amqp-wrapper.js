const amqp = require('amqplib');

class AmqpWrapper {
  async connectToQueue(consumeCallback) {
    this.connection = await amqp.connect("amqp://localhost:5672");
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue('transactions-queue');
    await this.channel.assertQueue('blockchain-queue');

    await this.channel.consume('transactions-queue', data => {
      consumeCallback(JSON.parse(Buffer.from(data.content)));
      this.channel.ack(data);
    });
  }

  async sendEncryptionToBlockchain(encryptedEventData) {
    this.channel.sendToQueue('blockchain-queue', Buffer.from(JSON.stringify(encryptedEventData)));
  }
}

module.exports = AmqpWrapper;