const express = require("express");
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
    this.api.post('/proof', async (req,res) => {

      const existingEvent = await this.findForValidEncryption(req.body.candidateEvent);
    
      if(existingEvent) {
        console.log('Event Encryption found in blockchain, now generate a proof of that !')
        // prove it
        const prover = new Prover(this.chacha20.key, existingEvent.iv);
        const proof = await prover.proofThatEventExistInFlow(Buffer.from(existingEvent.transaction.SHA256OfEventEncrypted,'hex'));
        console.log('Proof done');
        console.log('Decryption resolved by arithmetic circuit : ', new TextDecoder().decode(proof.plaintext), ' it match the hash of the candidate event');
        console.log(proof)
        res.send(
          { 
            existing: true, ProverResponse: { 
            proofJson: proof.proofJson, 
            encrypted_hash_candidate: Array.from(proof.encrypted_hash_candidate, byte => byte.toString(16).padStart(2, '0')).join(''),
            plaintext: new TextDecoder().decode(proof.plaintext)
          } 
        });

      }else{
        res.send({ existing: false, ProverResponse: undefined });
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
        console.log('found a valid hash : ', SHA256OfeventDecrypted)
        return {transaction: transaction, iv: decryptedIV, SHA256OfeventDecrypted };
      }
      
    };

    return undefined;
  }

  start() {
    this.api.listen(3334);
  }
}


module.exports = Server;

