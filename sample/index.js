const { Router } = require('express')
const path = require('path')
const sampleRun = require('./sampleRun')
const getAddress = require('./getAddress')
const getBal = require('./getBal')
const getMachineBal = require('./getMachineBal')
const getCur = require('./getCur')
// const sampleTimer = require('./sampleTimer')

const routes = Router()

// routes.get('/', serveStatic(path.resolve(__dirname, '../public'), { 'index': ['index.html', 'index.htm'] }))
// routes.get('/', sampleTimer)
routes.get('/address', getAddress)
routes.get('/bal', getBal)
routes.get('/mbal', getMachineBal)
routes.get('/cur', getCur)
routes.post('/', sampleRun)

module.exports = routes
