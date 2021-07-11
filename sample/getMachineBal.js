const createError = require('http-errors')
const machineBalance = require('../modules/machineBalance')

module.exports = async function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.log('Accessing [API]: ', req.method + ' ' + req.originalUrl || req.url, 'CLIENT ACCESS from', ip)
  try {
    var machine
    req.query.m ? machine = req.query.m : next(createError(400))
    var bal = await machineBalance(machine)
    res.status(200).json({
      message: 'OK',
      bal: bal
    })
  } catch (err) {
    console.error(err)
    next(createError(500))
  }
}
