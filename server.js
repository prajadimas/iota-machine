// server.js

// ==================== BASIC SERVER SETUP ====================== //
// ============================================================== //

// Packages needed
const express = require('express')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const serveStatic = require('serve-static')
const cron = require('node-cron')
const machineBalanceChecker = require('./modules/machineBalanceChecker')
var app = express()
require('dotenv').config()

/**
 *	helper function to log date+text to console:
 */
const log = (text) => {
	console.log(`[${new Date().toLocaleString()}] ${text}`)
}

// Includes routing
const sample = require('./sample/index')

// Socket IO server configurations
var server = require('http').createServer(app)
var io = require('socket.io')(server)
app.set('socketio', io)

// var clientIds = []

// All middleware configurations goes here
/* Configuration of the body-parser to get data from POST requests */
app.use(bodyParser.json({ limit: '2mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))
app.use('/sample', serveStatic(path.resolve(__dirname, './public'), { 'index': ['index.html', 'index.htm'] }))
app.use(cors())
app.use(helmet())

// ================== ROUTES FOR API REQUESTS =================== //
// ============================================================== //

app.get('/', function (req,res) {
  res.redirect('/sample')
  /* res.status(200).json({
		message: 'server is up and running'
	}) */
})

// Register services
app.use('/api', sample)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// Error handler
app.use(function (err, req, res, next) {
	var customMessage = {
		400: 'Please Comeback with Another Request',
		404: 'Please Try Another Route, Example: /analyzer',
		405: 'Please Try Another REST HTTP Method',
		409: 'Please Try Another Input Data, Already Exists',
		500: 'Please Try Again Later'
	}
	// set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {}
  // sent error message
	if (customMessage[err.status]) {
		res.status(err.status || 500).json({
			message: customMessage[err.status]
		})
	} else {
		res.status(err.status || 500).json({
			message: err.message
		})
	}
})

io.on('connection', (socket) => {
  log(`Client connected on ${socket.id}}`)
  // console.log('Client connected.')
  io.to(socket.id).emit('socket id', {
    id: socket.id
  })
  socket.on('timer', (data) => {
    // console.log(data)
    io.emit('timer count', data)
  })
  socket.on('disconnect', () => {
    log(`Client disconnected on ${socket.id}}`)
    // console.log('Client disconnected.')
  })
})

cron.schedule('0 */1 * * * *', async () => {
  log(`Running every 1 minute`)
  // console.log('running every 30 seconds')
  // console.log(io)
  var m1runner = await machineBalanceChecker(1)
  log(`Machine 1 ${JSON.stringify(m1runner).toString()}`)
  // console.log(m1runner)
  var m2runner = await machineBalanceChecker(2)
  log(`Machine 2 ${JSON.stringify(m2runner).toString()}`)
  // console.log(m2runner)
  var m3runner = await machineBalanceChecker(3)
  log(`Machine 3 ${JSON.stringify(m3runner).toString()}`)
  // console.log(m3runner)
  var m4runner = await machineBalanceChecker(4)
  log(`Machine 4 ${JSON.stringify(m4runner).toString()}`)
  // console.log(m4runner)
  var m5runner = await machineBalanceChecker(5)
  log(`Machine 5 ${JSON.stringify(m5runner).toString()}`)
  // console.log(m5runner)
  if (m1runner.d > 0) {
    io.emit('m1bal', {
      bal: m1runner.d
    })
  }
  if (m2runner.d > 0) {
    io.emit('m2bal', {
      bal: m2runner.d
    })
  }
  if (m3runner.d > 0) {
    io.emit('m3bal', {
      bal: m3runner.d
    })
  }
  if (m4runner.d > 0) {
    io.emit('m4bal', {
      bal: m4runner.d
    })
  }
  if (m5runner.d > 0) {
    io.emit('m5bal', {
      bal: m5runner.d
    })
  }
})

// Export our app for another purposes
module.exports = { app: app, server: server }
