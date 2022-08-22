const UserModel = require('../models/user');
const InternalException = require('../exeption');
const CountryService = require('./country');
const {
  isCountryCode, isCurrnecy, isUserName, isAmount,
} = require('./validation');

/**
 * Getting user by id
 * @param {string} id
 * @returns {object}
 */
function getUser(id) {
  return UserModel.getUser(id);
}

/**
 * Creating user
 * @param {object} data
 * @param {object} earning
 * @returns {object}
 */
async function createUser(data, earning) {
  // validate data
  const { countryCode, name } = data || {};
  const { currency, amount } = earning || {};

  if (
    !isAmount(amount)
    || !isCurrnecy(currency)
    || !isCountryCode(countryCode)
    || !isUserName(name)
  ) {
    throw new InternalException(
      'InvalidParameters',
      'One of the user input parameter is invalid',
    );
  }

  // create user
  const user = await UserModel.addUser({ countryCode, name }, { currency, amount });

  // Get Country
  const country = await CountryService.getCountryOrCreate({ code: countryCode });

  // re organiaze country top each time create user
  CountryService.reorganizeCountryTops(country, user.id, user.earning);

  return user;
}

module.exports = {
  getUser,
  createUser,
};
