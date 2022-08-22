const Countries = new Map();

/**
 * Creating user model
 * @param {object} data - Basic information
 * @returns {object}
 * */
function createModel(data) {
  return {
    code: data.code,
    tops: [],
  };
}

/**
 * Get country by country code
 * @param {string} countryCode
 * @returns {object | null}
 * */
async function getCountry(countryCode) {
  return Countries.get(countryCode);
}

/**
 * Get countries as an array
 * @returns {object | null}
 * */
async function getCountries() {
  return Array.from(Countries.values());
}

/**
 * Add new country
 * @param {object} countryCode
 * @returns {boolean}
 * */
async function addCountry(data) {
  const country = createModel(data);
  Countries.set(country.code, country);
  return country;
}

/**
 * Update country fields
 * @param {object} countryCode
 * @returns {boolean}
 * */
async function updateCountry(countryCode, data) {
  const country = await getCountry(countryCode);
  if (!country) return null;
  Countries.set(countryCode, { ...country, ...data });
  return true;
}

module.exports = {
  getCountry,
  addCountry,
  getCountries,
  updateCountry,
};
