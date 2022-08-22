const InternalException = require('../exeption');

const exchanges = {
  'eur/usd': 1.02,
};

/**
 * Exchanging from one currency to another
 * @param {string} fromCurrency
 * @param {string} toCurrency
 * @param {number} amount
 * @returns {number}
 */
function exchangeToCurrency(fromCurrency, toCurrency, amount) {
  if (fromCurrency === toCurrency) return amount;
  const currencies = [fromCurrency, toCurrency].sort();
  const exchange = exchanges[currencies.join('/')];
  const factor = fromCurrency > toCurrency ? 1 / exchange : exchange;
  return amount * factor;
}

/**
 * Compare two currencyes and
 * returns which is more
 * @param {object} one
 * @param {object} two
 * @returns {number}
 */
function copmareAmount(oneAmount, twoAmount) {
  if (oneAmount > twoAmount) return 1;
  if (oneAmount < twoAmount) return -1;
  return 0;
}

/**
 * Compare two currencyes and
 * returns copmareAmount
 * @param {object} one
 * @param {object} two
 * @returns {number}
 */
function copmareCurrencies(one, two) {
  if (one.currency === two.currency) {
    return copmareAmount(one.amount, two.amount);
  }

  const currencies = [one.currency, two.currency].sort();

  const key = currencies.join('/');
  if (!(key in exchanges)) {
    throw new InternalException(
      'ResourceNotFound',
      `${key} currency not found`,
    );
  }

  return copmareAmount(
    exchangeToCurrency(one.currency, 'usd', one.amount),
    exchangeToCurrency(two.currency, 'usd', two.amount),
  );
}

module.exports = {
  copmareCurrencies,
  exchangeToCurrency,
};
