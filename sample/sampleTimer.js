const fs = require('fs')
const path = require('path')
const createError = require('http-errors')
const timer = require('../modules/machineTimer')

module.exports = async function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  console.log('Accessing [API]: ', req.method + ' ' + req.originalUrl || req.url, 'CLIENT ACCESS from', ip)
  var io = req.app.get('socketio')
  var socketId = null
  try {
    // req.body.id ? socketId = req.body.id : socketId = null
    // console.log('Sentence: ', req.body.text)
    // socketId ? io.to(socketId).emit('process', { step: 'SENTENCE:\n', out: req.body.text + '\n' }) : socketId = socketId
    var timerCount = await timer(req.query.m, req.query.t)
    if (timerCount === 'stop') {
      res.status(200).json({
        message: 'OK'
      })
    }
  } catch (err) {
    console.error(err)
    next(createError(500))
  }
}
