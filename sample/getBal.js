const fs = require('fs')
const path = require('path')
const createError = require('http-errors')
const store = require('data-store')({
  path: path.resolve(__dirname, '../data/', 'run.json')
})

module.exports = async function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.log('Accessing [API]: ', req.method + ' ' + req.originalUrl || req.url, 'CLIENT ACCESS from', ip)
  try {
    var bal = 0
    store.load()
    store.get('bal') ? bal =  store.get('bal') : bal = bal
    res.status(200).json({
      message: 'OK',
      bal: bal
    })
  } catch (err) {
    console.error(err)
    next(createError(500))
  }
}
