const Server = require("./api/server");
const Blockchain = require("./blockchain/blockchain");
const AmqpWrapper = require("./messaging/amqp-wrapper");

class App {

  constructor() {
    this.amqpWrapper = new AmqpWrapper();
    this.api = new Server();
  }

  storeEncryptedEventToBlockchain = async (event) => {
    Blockchain.pushEncryptedEvent(event.timestamp, event.eventEncrypted, event.SHA256OfEventEncrypted, event.uniqueIvEncrypted)
  }

  async start() {
    await this.amqpWrapper.connectToQueue(this.storeEncryptedEventToBlockchain);
    this.api.start();
  }

}

module.exports = App;