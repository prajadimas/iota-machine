// https://www.coingecko.com/price_charts/692/eur/24_hours.json

const axios = require('axios')

module.exports = function () {
  return new Promise(async (resolve, reject) => {
    try {
      // Make a request for a user with a given ID
      let currencies = await axios.get('https://www.coingecko.com/price_charts/692/eur/24_hours.json')
      resolve(currencies.data)
    } catch (err) {
      reject(err)
    }
  })
}
