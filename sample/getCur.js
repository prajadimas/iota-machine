const createError = require('http-errors')
const eurExc = require('../modules/eurExc')

/**
 *	helper function to log date+text to console:
 */
const log = (text) => {
	console.log(`[${new Date().toLocaleString()}] ${text}`)
}

module.exports = async function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  log(`Accessing [API]: ${req.method} ${req.originalUrl || req.url}, CLIENT ACCESS from ${ip}`)
  // console.log('Accessing [API]: ', req.method + ' ' + req.originalUrl || req.url, 'CLIENT ACCESS from', ip)
  try {
    var currencies = await eurExc()
    // console.log('Currencies', currencies)
    var last = 0.7
    currencies['stats'].length > 0 ? last = currencies['stats'][currencies['stats'].length - 1][1] : last = last
    res.status(200).json({
      message: 'OK',
      eur: last
    })
  } catch (err) {
    log(`Error: ${JSON.stringify(err).toString()}`)
    // console.error(err)
    next(createError(500))
  }
}
