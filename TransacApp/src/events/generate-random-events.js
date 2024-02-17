const generateRandomCurrency = () => {
  const currencies = ["USD", "EUR", "YEN", "GBP", 'JPY', 'NOK'];
  return currencies[Math.floor(Math.random() * currencies.length)];
}

const generateRandomUser = (except) => {
  const users = ["Jessim", "Loïc", "Nasri", "Marc"];
  choosenUser = except;
  while(choosenUser == except) {
    choosenUser = users[Math.floor(Math.random() * users.length)]
  }
  return choosenUser;
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