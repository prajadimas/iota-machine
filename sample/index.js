const { Router } = require('express')
const path = require('path')
const sampleRun = require('./sampleRun')
const getBal = require('./getBal')
// const sampleTimer = require('./sampleTimer')

const routes = Router()

// routes.get('/', serveStatic(path.resolve(__dirname, '../public'), { 'index': ['index.html', 'index.htm'] }))
// routes.get('/', sampleTimer)
routes.get('/bal', getBal)
routes.post('/', sampleRun)

module.exports = routes
