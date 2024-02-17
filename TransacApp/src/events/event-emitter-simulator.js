const { generateRandomEvents } = require("./generate-random-events");

class EventEmitterSimulator {

  intervalId;

  startEmitEvents = (processEvents) => {
    if(!this.intervalId) {
      this.intervalId = setInterval(()=> {
        processEvents(generateRandomEvents());
      }, 10000);
    }
  }

  stopEmitEvents = () => {
    if(this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}

module.exports = EventEmitterSimulator;