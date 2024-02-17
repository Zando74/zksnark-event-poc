const express = require("express");
const Blockchain = require("../blockchain/blockchain");

class Server {
  constructor() {
    this.api = express();
    this.api.use(express.json());
    this.api.get('/blockchain', (req,res) => {
      res.send({ blockchain: Blockchain.getAll()})
    });
  }

  start() {
    this.api.listen(3333);
  }
}


module.exports = Server;

