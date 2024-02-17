const express = require("express");
const cors = require('cors');
const Blockchain = require("../blockchain/blockchain");

class Server {
  constructor() {
    this.api = express();
    this.api.use(cors());
    this.api.use(express.json());
    this.api.get('/blockchain', (req,res) => {
      res.send({ blockchain: Blockchain.getAll()})
    });
    this.api.post('/transaction-by-encrypted-hash', (req,res) => {
      const transaction = Blockchain.findTransactionByEncryptedSHA256OfEvent(req.body.SHA256OfEncryptedEvent);
      res.send({ transaction });
    })
  }

  start() {
    this.api.listen(3333);
  }
}


module.exports = Server;

