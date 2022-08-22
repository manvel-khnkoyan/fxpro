const { v4: uuidv4 } = require('uuid');

const Users = new Map();

/**
 * Creating user model
 * @param {object} data - Basic information
 * @param {object} earning - earning ammount and currency
 * @returns {object}
 * */
function createModel(data, earning) {
  const { countryCode, name } = data;
  const { amount, currency } = earning;
  return {
    id: uuidv4(),
    name,
    countryCode,
    earning: {
      amount, currency,
    },
  };
}

/**
 * Get country by user id
 * @param {string} countryCode
 * @returns {object | null}
 * */
function getUser(id) {
  return Users.get(id);
}

/**
 * Create new user
 * @param {string} countryCode
 * @returns {object | null}
 * */
async function addUser(data, earning) {
  const user = createModel(data, earning);
  Users.set(user.id, user);
  return user;
}

async function updateUser(id, data) {
  const user = await getUser(id);
  if (!user) return null;

  Users.set(id, { ...user, ...data });
  return true;
}

module.exports = {
  updateUser,
  getUser,
  addUser,
};
