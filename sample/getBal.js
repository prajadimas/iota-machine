const fs = require('fs')
const path = require('path')
const createError = require('http-errors')
const store = require('data-store')({
  path: path.resolve(__dirname, '../data/', 'run.json')
})

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
    var bal = 0
    store.load()
    store.get('bal') ? bal =  store.get('bal') : bal = bal
    res.status(200).json({
      message: 'OK',
      bal: bal
    })
  } catch (err) {
    log(`Error: ${JSON.stringify(err).toString()}`)
    // console.error(err)
    next(createError(500))
  }
}
