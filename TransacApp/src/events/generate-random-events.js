const generateRandomCurrency = () => {
  const currencies = ["USD", "EUR", "AUD", "GBP", 'JPY'];
  return currencies[Math.floor(Math.random() * currencies.length)];
}

const generateRandomUser = (except) => {
  const users = ["Jessim", "Loïc", "Nasri", "Marc"];
  let chosenUser = except;
  while(chosenUser == except) {
    chosenUser = users[Math.floor(Math.random() * users.length)]
  }
  return chosenUser;
}

const generateRandomAmount = () => {
  return Math.floor(Math.random() * 10 + 1) * 1000;
}


const generateRandomEvents = () => {
  const choosenEmitter = generateRandomUser()
  return {
    "timestamp": Date.now(),
    "currency": generateRandomCurrency(),
    "emitter": choosenEmitter,
    "receiver": generateRandomUser(choosenEmitter),
    "amount": generateRandomAmount()
  };
}

module.exports = { generateRandomEvents };