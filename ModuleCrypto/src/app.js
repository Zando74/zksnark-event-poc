const Chacha20Wrapper = require("./crypto/chacha20-wrapper");
const { hash } = require("./crypto/sha256-wrapper");
const crypto = require('crypto');
const { KEY, IV } = require("../config");
const AmqpWrapper = require("./messaging/amqp-wrapper");

class App {

  constructor() {
    const key = Buffer.from(KEY, 'hex');
    const iv = Buffer.from(IV, 'hex');
    this.chacha20 = new Chacha20Wrapper(key,iv);
    this.amqpWrapper = new AmqpWrapper();
  }

  EncryptEvents = async (event) => {
    const extractedDateFromEvent = event.timestamp;

    delete event.timestamp;
    const stringifiedEvent = JSON.stringify(event);
    const hashValueOfEvent = hash(stringifiedEvent);

    const uniqueIV = crypto.randomBytes(12);

    const SHA256OfEventEncrypted = this.chacha20.encryptWithCustomIV(hashValueOfEvent, uniqueIV);
    const eventEncrypted = this.chacha20.encryptWithCustomIV(stringifiedEvent, uniqueIV);
    const uniqueIvEncrypted = this.chacha20.encrypt(uniqueIV.toString('hex'));
    this.amqpWrapper.sendEncryptionToBlockchain({
      timestamp: extractedDateFromEvent,
      eventEncrypted: Array.from(eventEncrypted, byte => byte.toString(16).padStart(2, '0')).join(''),
      SHA256OfEventEncrypted: Array.from(SHA256OfEventEncrypted, byte => byte.toString(16).padStart(2, '0')).join(''),
      uniqueIvEncrypted: Array.from(uniqueIvEncrypted, byte => byte.toString(16).padStart(2, '0')).join('')
    });

    console.log('Transaction envoyé à la blockchain : \n', {
      timestamp: extractedDateFromEvent, 
      eventEncrypted: Array.from(eventEncrypted, byte => byte.toString(16).padStart(2, '0')).join(''), 
      SHA256OfEventEncrypted: Array.from(SHA256OfEventEncrypted, byte => byte.toString(16).padStart(2, '0')).join(''),
      uniqueIvEncrypted: Array.from(uniqueIvEncrypted, byte => byte.toString(16).padStart(2, '0')).join('')
    });
  }

  async start() {
    await this.amqpWrapper.connectToQueue(this.EncryptEvents);
  }



}

module.exports = App;