const dotenv = require('dotenv');

dotenv.config();

const { KEY, IV } = process.env;

module.exports = {
  KEY: KEY,
  IV: IV
};