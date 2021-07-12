const createError = require('http-errors')
const QRCode = require('qrcode')
const machineAddress = require('../modules/machineAddress')

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
    var machine
    req.query.m ? machine = req.query.m : next(createError(400))
    var addr = await machineAddress(machine)
    var url = await QRCode.toDataURL(addr)
    res.status(200).json({
      message: 'OK',
      addr: addr,
      url: url
    })
  } catch (err) {
    log(`Error: ${JSON.stringify(err).toString()}`)
    // console.error(err)
    next(createError(500))
  }
}
