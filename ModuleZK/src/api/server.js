const express = require("express");
const cors = require('cors');
const { KEY, IV } = require("../../config");
const Prover = require("../zksnark/prover");
const Chacha20Wrapper = require("../crypto/chacha20-wrapper");
const { hash } = require("../crypto/sha256-wrapper");

class Server {
  constructor() {
    const key = Buffer.from(KEY, 'hex');
    const iv = Buffer.from(IV, 'hex');

    this.chacha20 = new Chacha20Wrapper(key, iv);

    this.api = express();
    this.api.use(express.json());
    this.api.use(cors());
    this.api.post('/proof', async (req,res) => {
      console.log(req.body)
      const existingEvent = await this.findForValidEncryption(req.body.candidateEvent);
    
      if(existingEvent) {
        console.log('Event Encryption exist in blockchain, now generate a proof of that !')
        const prover = new Prover(this.chacha20.key, existingEvent.iv);
        const proof = await prover.proofThatEventExistInFlow(new Uint8Array(Buffer.from(existingEvent.transaction.SHA256OfEventEncrypted,'hex')));
        console.log('Proof done');
        res.send(
          { 
            existing: true, proverResponse: { 
            proofJson: proof.proofJson, 
            encrypted_hash_candidate: proof.encrypted_hash_candidate,
            plaintext: proof.plaintext
          } 
        });

      }else{
        console.log('Event Encryption not found in blockchain, no proof can be possible try to forge it')
        const existingEvent = await this.getFirstValidEncryption(req.body.candidateEvent);
        const prover = new Prover(this.chacha20.key, existingEvent.iv);

        const hashedEvent = hash(JSON.stringify(req.body.candidateEvent));
        const fakeProof = await prover.generateFakeProof(new Uint8Array(Buffer.from(existingEvent.transaction.SHA256OfEventEncrypted,'hex')), hashedEvent);
        console.log('Fake Proof done');
        res.send(
          { 
            existing: true, proverResponse: { 
            proofJson: fakeProof.proofJson, 
            encrypted_hash_candidate: fakeProof.encrypted_hash_candidate,
            plaintext: fakeProof.plaintext
          } 
        });
      }
    });
  }

  findForValidEncryption = async (plaintext) => {
    const hashedValue = hash(JSON.stringify(plaintext));
    const jsonResponse = await (await fetch('http://localhost:3333/blockchain')).json();
    for(let transaction of jsonResponse.blockchain) {

      //first decrypt IV
      const decryptedIV = Buffer.from(this.chacha20.decrypt(Buffer.from(transaction.uniqueIvEncrypted,'hex')), 'hex');

      //use it to decrypt hashed event
      const SHA256OfeventDecrypted = this.chacha20.decryptWithCustomIV(Buffer.from(transaction.SHA256OfEventEncrypted,'hex'), decryptedIV);

      // if found return it
      if(SHA256OfeventDecrypted === hashedValue){
        return {transaction: transaction, iv: decryptedIV, SHA256OfeventDecrypted };
      }
      
    };

    return undefined;
  }

  getFirstValidEncryption = async () => {
    let validTransaction = (await (await fetch('http://localhost:3333/blockchain')).json()).blockchain[0];
    const decryptedIV = Buffer.from(this.chacha20.decrypt(Buffer.from(validTransaction.uniqueIvEncrypted,'hex')), 'hex');
    const SHA256OfeventDecrypted = this.chacha20.decryptWithCustomIV(Buffer.from(validTransaction.SHA256OfEventEncrypted,'hex'), decryptedIV);
    return {transaction: validTransaction, iv: decryptedIV, SHA256OfeventDecrypted };
  }

  start() {
    this.api.listen(3334);
  }
}


module.exports = Server;

