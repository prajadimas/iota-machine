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
// const Bree = require('bree')
// const cron = require('node-cron')
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
  log(`Client connected on ${socket.id}`)
  // console.log('Client connected.')
  io.to(socket.id).emit('socket id', {
    id: socket.id
  })
	socket.on('mbal1', async (data) => {
    // console.log(data)
		log(`Machine 1 check`)
		var m1runner = await machineBalanceChecker(1)
	  log(`Machine 1 ${JSON.stringify(m1runner).toString()}`)
		if (m1runner.d > 0) {
	    io.emit('m1bal', {
	      bal: m1runner.d
	    })
	  }
  })
	/* socket.on('mbal2', async (data) => {
    // console.log(data)
		log(`Machine 2 check`)
		var m2runner = await machineBalanceChecker(2)
	  log(`Machine 2 ${JSON.stringify(m2runner).toString()}`)
		if (m2runner.d > 0) {
	    io.emit('m2bal', {
	      bal: m2runner.d
	    })
	  }
  })
	socket.on('mbal3', async (data) => {
    // console.log(data)
		log(`Machine 3 check`)
		var m3runner = await machineBalanceChecker(3)
	  log(`Machine 3 ${JSON.stringify(m3runner).toString()}`)
		if (m3runner.d > 0) {
	    io.emit('m3bal', {
	      bal: m3runner.d
	    })
	  }
  })
	socket.on('mbal4', async (data) => {
    // console.log(data)
		log(`Machine 4 check`)
		var m4runner = await machineBalanceChecker(4)
	  log(`Machine 4 ${JSON.stringify(m4runner).toString()}`)
		if (m4runner.d > 0) {
	    io.emit('m4bal', {
	      bal: m4runner.d
	    })
	  }
  })
	socket.on('mbal5', async (data) => {
    // console.log(data)
		log(`Machine 5 check`)
		var m5runner = await machineBalanceChecker(5)
	  log(`Machine 5 ${JSON.stringify(m5runner).toString()}`)
		if (m5runner.d > 0) {
	    io.emit('m5bal', {
	      bal: m5runner.d
	    })
	  }
  }) */
  socket.on('timer', (data) => {
    // console.log(data)
    io.emit('timer count', data)
  })
  socket.on('disconnect', () => {
    log(`Client disconnected on ${socket.id}`)
    // console.log('Client disconnected.')
  })
})

//
// NOTE: see the "Instance Options" section below in this README
// for the complete list of options and their defaults
//
// const bree = new Bree({
  //
  // NOTE: by default the `logger` is set to `console`
  // however we recommend you to use CabinJS as it
  // will automatically add application and worker metadata
  // to your log output, and also masks sensitive data for you
  // <https://cabinjs.com>
  //
  // logger: new Cabin(),

  //
  // NOTE: instead of passing this Array as an option
  // you can create a `./jobs/index.js` file, exporting
  // this exact same array as `module.exports = [ ... ]`
  // doing so will allow you to keep your job configuration and the jobs
  // themselves all in the same folder and very organized
  //
  // See the "Job Options" section below in this README
  // for the complete list of job options and configurations
  //
  /* jobs: [
    // runs `./jobs/sample.js` **NOT** on start, but every 10s
    {
      name: 'sample',
      timeout: false, // <-- specify `false` here to prevent default timeout (e.g. on start)
      interval: '10s'
    }
  ] */
// })

// bree.start()

/**
 *

cron.schedule('0 /1 * * * *', async () => {
	try {
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
	} catch (err) {
		log(`Error: ${JSON.stringify(err).toString()}`)
	}
})

 *
 */

// Export our app for another purposes
module.exports = { app: app, server: server }
