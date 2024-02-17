const App = require("./app");

const main = async () => {
  const app = new App();
  await app.start();
}

main();