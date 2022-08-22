const countries = require('../countries-names');

module.exports = {
  isCurrnecy: (currency) => ['usd', 'eur'].includes(currency),
  isAmount: (amount) => typeof amount === 'number',
  isUserName: (username) => /^[0-9a-zA-Z_.-]+$/.test(username),
  isCountryCode: (countryCode) => countryCode in countries,
};
