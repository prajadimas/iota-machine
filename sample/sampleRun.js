const fs = require('fs')
const path = require('path')
const createError = require('http-errors')
const store = require('data-store')({
  path: path.resolve(__dirname, '../data/', 'run.json')
})
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
    console.log('Body Request: ', req.body)
    if (store.get('stat.' + req.body.m) === 1) {
      res.status(200).json({
        message: 'In Use'
      })
    } else {
      var bal = 0
      store.get('bal') ? bal =  store.get('bal') : bal = bal
      store.set('stat.' + req.body.m, 1)
      store.load()
      store.set('bal', bal + Number(req.body.a))
      store.load()
      var timerCount = await timer(req.body.m, req.body.t)
      store.set('stat.' + req.body.m, 0)
      store.load()
      res.status(200).json({
        message: 'OK',
        machine: req.body.m,
        timeleft: 0
      })
    }
  } catch (err) {
    console.error(err)
    next(createError(500))
  }
}
