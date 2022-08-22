const CountryModel = require('../models/country');
const { isCountryCode } = require('./validation');
const { copmareCurrencies } = require('./exchange');
const InternalException = require('../exeption');

//
const TOP_MAX_COUNT = 20;

/**
 * This function get country,
 * or create it if it doesn't exist
 * @param {object} data
 * @returns {Promise<object>}
 */
async function getCountryOrCreate(data) {
  /*
   * Validating incoming data */
  const { code } = data;
  if (!isCountryCode(code)) {
    throw new InternalException(
      'InvalidParameters',
      'Invalid Country Code',
    );
  }

  // Get country by code and return
  const country = await CountryModel.getCountry(code);
  if (country) return country;

  return CountryModel.addCountry({ code });
}

/**
 * This function receice country and new earnings
 * @param {object} country
 * @param {object} earning
 * @returns {void}
 */
async function reorganizeCountryTops(country, userId, earning) {
  // When some of this heppend then reorganize
  const some = (item) => userId === item.userId // if user already exists in top
  || copmareCurrencies(country.tops.at(-1).earning, earning) < 0; // or earning is high
  // or at least
  const reorganize = !country.tops.length
  || country.tops.length < TOP_MAX_COUNT
  || country.tops.some(some);

  if (reorganize) {
    // Sort tops
    const sorted = country.tops.concat({ userId, earning });
    sorted.sort((one, two) => copmareCurrencies(two.earning, one.earning));

    // Uniqe by user id
    const uniqueMap = new Map();
    sorted.forEach((item) => !uniqueMap.has(item.userId) && uniqueMap.set(item.userId, item));

    // Create new tops
    const tops = Array.from(uniqueMap.values()).slice(0, TOP_MAX_COUNT);

    // update new generated tops into the counties
    CountryModel.updateCountry(country.code, { tops });
  }
}

/**
 * Getting all countries in onew array
 * @param {object} country
 * @param {object} earning
 * @returns {void}
 */
async function getCountries() {
  return CountryModel.getCountries();
}

module.exports = {
  getCountryOrCreate,
  reorganizeCountryTops,
  getCountries,
};
