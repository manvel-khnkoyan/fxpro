const listOfCountries = require('../countries-names');
const listOfCurrencies = require('../currency-codes');
const { createUser } = require('../app/user');

const currencyKeys = Object.keys(listOfCurrencies);
const countriesKesy = Object.keys(listOfCountries);

function randomFromList(list) {
  // eslint-disable-next-line no-bitwise
  return list[(Math.random() * list.length) | 0];
}

function randomText() {
  return Math.random().toString(36).slice(2, 7);
}

function randomAmount() {
  return Number((Math.random() * (120 - 0.0200) + 0.0200).toFixed(4));
}

const size = 1000;
// eslint-disable-next-line no-plusplus
for (let i = 0; i < size; i++) {
  const name = randomText();
  const amount = randomAmount();
  const currency = randomFromList(currencyKeys);
  const countryCode = randomFromList(['US', 'CY', 'BR', 'MX']);

  setTimeout(() => createUser({ countryCode, name }, { currency, amount }), 0);

  if (i >= size - 1) console.log(`Generated random ${size} users`);
}
