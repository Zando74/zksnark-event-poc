const Server = require("./api/server");

class App {

  constructor() {
    this.api = new Server();
  }

  start() {
    this.api.start();
  }

}

module.exports = App;