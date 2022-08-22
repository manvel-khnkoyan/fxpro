const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const InternalException = require('../exeption');
const { getCountries } = require('../app/country');
const { createUser, getUser } = require('../app/user');
const { exchangeToCurrency } = require('../app/exchange');
const listOfCountries = require('../countries-names');
const listOfCurrencies = require('../currency-codes');

// User generating script for testin purposes
require('../cli/generate-users');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(morgan('tiny'));

app.post('/users', (req, res, next) => {
  const { name, countryCode, earning } = req.body || {};
  createUser({ name, countryCode }, earning).then((data) => {
    res.json(data);
  }).catch(next);
});

app.get('/country/statistics', (req, res, next) => {
  getCountries()
    .then((countries) => {
      const result = [];
      countries.forEach((country) => {
        const tops = country.tops.slice(0, 10);
        if (tops.length) {
          const sum = tops
            .map(({ earning }) => exchangeToCurrency(earning.currency, 'usd', earning.amount))
            .reduce((pre, curr) => pre + curr, 0);
          const average = sum / tops.length;

          result.push({
            country: listOfCountries[country.code],
            average: `$${average}`,
            users: tops.map(({ userId, earning }) => ({
              user: getUser(userId).name,
              earning: `${listOfCurrencies[earning.currency]}${earning.amount}`,
            })),
          });
        }
      });
      res.json(result);
    })
    .catch(next);
});

/*
 * Error handling */
app.use((err, req, res, next) => {
  const json = { message: err.message };
  if (err instanceof InternalException) {
    if (err.name === 'InvalidParameters') return res.status(400).json(json);
    if (err.name === 'ResourceNotFound') return res.status(404).json(json);
  }

  console.log(JSON.stringify(err.stack));
  res.status(500).json(json);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
